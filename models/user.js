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
        // User.hasmany(models.Artist)
      },
      encryptPass: function(password) {
        var hash = bcrypt.hashSync(password, salt);
        return hash;
      },
      comparePass: function(userpass, dbpass) {
        return bcrypt.compareSync(userpass, dbpass);
      },
      createNewUser: function(first_name, last_name, email_address, password, err, success) {
        if (password.length < 6) {
          err({message:"Password should be more than six characters"});
        }
        else{
          User.create({
            first_name: first_name,
            last_name: last_name,
            email_address: email_address,
            password: this.encryptPass(password),
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
