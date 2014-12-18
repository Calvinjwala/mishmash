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
            }).done(function(error, artist) {
            if(error) {
              console.log(error);
            }
            else{
              success(artist);
            }
          });
        }
    }
  });
  return Artist;
};

// var newValues = {};
//             if (city) {
//               newValues.city = city;
//             }
//             if (state) {
//               newValues.state = state;
//             }
//             if (zip_code) {
//               newValues.zip_code = zip_code;
//             }
//             if (category) {
//               newValues.category = category;
//             }
//             if (artist_name) {
//               newValues.artist_name = artist_name;
//             }
// var newValues = {};
//           if (about_me) {
//             newValues.about_me = about_me;
//           }
//           if (cover_photo) {
//             newValues.cover_photo = cover_photo;
//           }
//           if (profile_photo) {
//             newValues.profile_photo = profile_photo;
//           }
//           user.updateAttributes(newValues).success(function(updatedUser) {
//             console.log("User updated about_me is: ", updatedUser.about_me);
//             success(updatedUser);
//           }).error(function (error) {
//             err(error);
//           });
//         }).error(function (error) {
//           err(error);
//         });

