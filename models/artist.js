"use strict";

module.exports = function(sequelize, DataTypes) {
  var Artist = sequelize.define("Artist", {
    artist_name: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    category: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Artist.hasMany(models.Album, {foreignKey: "ArtistId"});
        Artist.belongsTo(models.User);
      }
    }
  });

  return Artist;
};
