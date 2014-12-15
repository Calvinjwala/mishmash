"use strict";

module.exports = function(sequelize, DataTypes) {
  var Album = sequelize.define("Album", {
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    main_image: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    meta_description: DataTypes.TEXT,
    is_available: DataTypes.BOOLEAN,
    price: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Album.belongsTo(models.Artist);
      }
    }
  });

  return Album;
};
