"use strict";

var bcrypt = require('bcrypt');
var passport = require('passport');
var passportLocal = require('passport-local');
var salt = bcrypt.genSaltSync(10);

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email_address: DataTypes.STRING,
    password: DataTypes.STRING,
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
              if (error.name === 'SequelizeUniqueConstraintError'){
                err({message: 'An account with that username already exists', email_address:email_address});
              }
              else{
                success({message: 'Your account has been created! Please log in.'});
              }
            }
          });
        }
      },
    }
  });

  return User;
};
