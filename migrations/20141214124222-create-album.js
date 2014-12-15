"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Albums", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.STRING
      },
      main_image: {
        type: DataTypes.BOOLEAN
      },
      description: {
        type: DataTypes.TEXT
      },
      meta_description: {
        type: DataTypes.TEXT
      },
      is_available: {
        type: DataTypes.BOOLEAN
      },
      price: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Albums").done(done);
  }
};