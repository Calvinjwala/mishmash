"use strict";

module.exports = function(sequelize, DataTypes) {
  var Album = sequelize.define("Album", {
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    main_image: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    meta_description: DataTypes.TEXT,
    is_available: DataTypes.BOOLEAN,
    price: DataTypes.STRING,
    ArtistId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Album.belongsTo(models.Artist);
      }
    },
    createNewAlbum:function(title, image, description, price, err, success) {
      Album.create({
      title: title,
      image: image,
      description: description,
      price: price
      }).done(function(error, album) {
      if(error) {
        console.log(error);
      }
      else{
        success(album);
      }
    });
  }
  });

  return Album;
};
