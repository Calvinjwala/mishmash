"use strict";

module.exports = function(sequelize, DataTypes) {
  var Album = sequelize.define("Album", {
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    mainImage: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    metaDescription: DataTypes.TEXT,
    isAvailable: DataTypes.BOOLEAN,
    price: DataTypes.STRING,
    ArtistId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Album.belongsTo(models.Artist);
      }
    }
  });

  return Album;
};
