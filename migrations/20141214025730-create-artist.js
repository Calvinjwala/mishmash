"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Artists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      artist_id: {
        type: DataTypes.STRING
      },
      artist_name: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      state: {
        type: DataTypes.STRING
      },
      zip_code: {
        type: DataTypes.STRING
      },
      category: {
        type: DataTypes.INTEGER
      },
      UserId: {
        type: DataTypes.INTEGER,
        foreignKey: true
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
    migration.dropTable("Artists").done(done);
  }
};