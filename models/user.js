"use strict";

var bcrypt = require('bcrypt');
var passport = require('passport');
var passportLocal = require('passport-local');
var salt = bcrypt.genSaltSync(10);

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email_address: {
      type: DataTypes.STRING,
      unique: true,
      allowNull:false,
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [6, 100000000]
      }
    },
    profile_photo: DataTypes.STRING,
    cover_photo: DataTypes.STRING,
    about_me: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        User.hasOne(models.Artist);
      },
      // salt the password!
      encryptPass: function(password) {
        var hash = bcrypt.hashSync(password, salt);
        return hash;
      },
      // do not salt twice! make sure that the password matches the original one
      comparePass: function(userpass, dbpass) {
        return bcrypt.compareSync(userpass, dbpass);
      },
      createNewUser: function(first_name, last_name, email_address, password, err, success) {
        if (password.length < 6) {
          err({message:"Password should be more than six characters"});
        }
        else{
          // the minimum needed to create User
          User.create({
            first_name: first_name,
            last_name: last_name,
            email_address: email_address,
            // encrypt the password, pass it through the encryptPass function
            password: this.encryptPass(password),
            //these are the minimum requirements needed before creating a User
          }).done(function(error, user){
            if (error) {
              console.log(error);
              if(error.name === 'SequelizeValidationError'){
                err({message: 'Your password should be at least 6 characters long', password: password});
              }
              else if (error.name === 'SequelizeUniqueConstraintError'){
                err({message: 'An account with that email already exists', email_address:email_address});
              }
              err({message: "Unknown error"});
            }
            else{
              success({message: 'Account created, please log in now'});
            }
          });
        }
      },
      }
  }
  );

    passport.use(new passportLocal.Strategy({
        usernameField: 'email_address',
        passwordField: 'password',
        passReqToCallback : true
    },

    function(req, email_address, password, done) {
      console.log("passport:" + email_address);
      // find a user in the DB
      User.find({
          where: {
            email_address: email_address,
          }
        })
        // when that's done,
        .done(function(error,user){
          if(error){
            console.log(error);
            return done (err, req.flash('loginMessage', 'Oops! Something went wrong.'));
          }
          if (user === null){
            console.log("username does not exist");
            return done (null, false, req.flash('loginMessage', 'Username does not exist.'));
          }
          if ((User.comparePass(password, user.password)) !== true){
            console.log("invalid password");
            return done (null, false, req.flash('loginMessage', 'Invalid Password'));
          }
          console.log("logging in", user);
          done(null, user);
        });
      }));
  return User;
};
