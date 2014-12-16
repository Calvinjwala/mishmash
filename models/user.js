"use strict";

var bcrypt = require('bcrypt');
var passport = require('passport');
var passportLocal = require('passport-local');
var salt = bcrypt.genSaltSync(10);

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    password: DataTypes.STRING,
    passwordDigest: DataTypes.STRING,
    resetToken: DataTypes.STRING,
    profilePhoto: DataTypes.STRING,
    coverPhoto: DataTypes.STRING,
    aboutMe: DataTypes.TEXT
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
      createNewUser: function(firstName, lastName, emailAddress, password, err, success) {
        if (password.length < 6) {
          err({message:"Password should be more than six characters"});
        }
        else{
          // the minimum needed to create User
          User.create({
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress,
            // encrypt the password, pass it through the encryptPass function
            password: this.encryptPass(password),
            //these are the minimum requirements needed before creating a User
          }).done(function(error, user){
            if (error) {
              console.log(error);
              if (error.name === 'SequelizeUniqueConstraintError'){
                err({message: 'An account with that username already exists', emailAddress:emailAddress});
              } else {
                err({message: "Unknown error"});
              }
            } else{
              success({message: 'Your account has been created! Please log in.'});
            }
          });
        }
      },
    }
  });

  return User;
};
