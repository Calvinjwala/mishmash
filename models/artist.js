"use strict";

module.exports = function(sequelize, DataTypes) {
  var Artist = sequelize.define("Artist", {
    artist_id: DataTypes.STRING,
    artist_name: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    category: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Artist;
};