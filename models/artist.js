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
      },
      createNewArtist:function(city, state, zip_code, category, artist_name, err, success ) {
        Artist.create({
            city: city,
            state: state,
            zip_code: zip_code,
            category: category,
            artist_name: artist_name
          }).done(function(error,user) {
            if(error) {
              console.log(error);
            }
            else{
              success({message: 'Account created, please log in now'});
            }
          });
        }
    }
  });
  return Artist;
};


