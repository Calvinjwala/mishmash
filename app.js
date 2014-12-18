var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  session = require("cookie-session"),
  db = require("./models/index"),
  flash = require('connect-flash'),
  methodOverride = require('method-override'),
  // angular = require('angular'),
  app = express();



  var morgan = require('morgan');
  // var http = require('http').Server(app);
  // var io = require('socket.io')(http);
  var routeMiddleware = require("./config/routes");
  var geocoderProvider = 'google';
  var httpAdapter = 'http';
  var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter);


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}) );
app.use(methodOverride('_method'));

app.use(session( {
  secret: 'thisismysecretkey',
  name: 'choco chip!',
  // this is in milliseconds
  maxage: 3600000
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

module.exports = app;

app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});

// prepare our serialize functions
passport.serializeUser(function(user, done){
  console.log("serialize ran!");
  done(null, user.id);
});

// prepare our deserialize function
passport.deserializeUser(function(id, done){
  console.log("deserialize ran!");
  db.User.find({
    where: {
      id: id
    }
  })
  .done(function(error, user){
    done(error, user);
  });
});


// ROUTING //

// HOME HOME HOME LANDING PAGE//
app.get('/', routeMiddleware.preventLoginSignup, function(req, res){
  res.render('index');
});

// app.get('/search', function(req,res){
//   console.log("IM HERE YO YOY OYO");
//   // db.Artist.All().done(function(err, artists){
//   //   console.log(artists);
//     // geocoder.geocode(artists.zip_code, function(err, longlat) {
//     // console.log(longlat);
//     //   if (longlat) {
//     //     var zip_code = (longlat[0].longitude + ', ' + longlat[0].latitude);
//     //     console.log(zip_code);
//     //   }
//     //   else {
//     //     console.log(err);
//     //   }
//     // });
//     // var coords = artist.map(function (artist) {
//     //   return {name: user.first_name, location: artist.zip_code, category:user.category};
//     // });
//     // res.render('search_results/search', {userInfo: JSON.stringify(coords)});
//   // });
// });


// SIGN UP
app.post('/submit', function(req, res){
  db.User.createNewUser(req.body.first_name, req.body.last_name, req.body.email_address, req.body.password,
        function(err){
          console.log(err);
          res.redirect('/');
        },
        function(success){
          // res.flash("GREAT SUCCESS!");
          console.log(success);
          // res.locals.success_messages;
          // res.redirect('/');
          res.redirect('/');
        }
      );
});


// LOG IN
app.post('/login', passport.authenticate('local',{
  successRedirect: '/dashboard',
  failureRedirect: '/',
  failureFlash: true
}));


// ADDING TO THE USER INFORMATION and UPDATES
app.post('/profile', function(req,res){
  console.log("user is ", req.user.first_name);
  db.User.updateInfo(
    req.user.id,
    req.body.profile_photo,
    req.body.cover_photo,
    req.body.about_me,
    function (updatedUser) {
      var id = req.user.id;
      res.redirect('/profile/'+ id);
    },
    function (error) {
      var id = req.user.id;
      res.redirect('/profile/'+ id);
    }
  );
});


// USER PROFILE ROUTE
app.get('/profile/:id', function(req,res){
  res.render('users/user_profile', {user: req.user});
});

app.get('/dashboard', routeMiddleware.checkAuthentication, function(req, res){
  res.render('users/dashboard', {user: req.user});
});

// SEARCH page, anyone can view //
app.get('/search', function(req, res){
  LatLngArr = [];
  db.Artist.findAll().done(function(err, artists){
    var total = artists.length;
    var current = 0;
    artists.forEach(function(artist){
      // var cat = artist.category;
      geocoder.geocode(artist.zip_code, function(err, latlng){
        if (latlng) {
          var zip_code=(latlng[0].latitude + ', ' + latlng[0].longitude);
          // console.log(zip_code);
          LatLngArr.push(zip_code);
          // console.log("this is one latlng", zip_code);
          current++;
          if (current >= total) {
            console.log("this is the array ", LatLngArr);
            res.render('search_results/search', {user: req.user, location: LatLngArr});
          }
        }
      });
      // console.log("first time, ", LatLngArr);
    });
  });
});

// LINK TO BECOME AN ARTIST
// need to make it disappear once they are officially artists
app.get('/new-artist', function(req, res){
  res.render('artists/new_artist', {user: req.user, artist: req.artist});
});

app.get('/artist/:id', function(req, res){
  res.render('artists/artist_profile', {artist: req.params.artist, user: req.user});
  console.log(artist);
  console.log(user);
});

// USER PROFILE
// DEPLOY BELOW ONCE login works
// app.get('/my_profile', function(req,res){
//   res.render('users/user_profile', {user: req.user});
// });
  // console.log(db.user);
  // console.log(this.User);


// app.get('/my_profile', function(req,res){
//   res.render('users/user_profile');
// });

app.post('/artist_submit', function(req, res){
  db.Artist.createNewArtist(
    req.body.city,
    req.body.state,
    req.body.zip_code,
    req.body.category,
    req.body.artist_name,
    function(err){
      console.log("ERROR!");
      console.log(err);
      res.redirect('/dashboard');//, {message: err.message, email_address: req.body.email_address});
    },
    function(artist){
      console.log("GREAT SUCCESS!");
      console.log("new artist", artist.artist_name);
      artist.setUser(req.user).done(function (err, artist) {
        if (err) {
          res.redirect('/dashboard');
        } else {
          res.render('/profile/:id', {artist: req.artist});
        }
      });
    });
    db.Album.createNewAlbum(
      req.body.title,
      req.body.image,
      req.body.description,
      req.body.price,
      function(err){
        console.log("ERROR!");
        console.log(err);
        res.redirect('/dashboard');
      }, function(album){
        console.log("another success!");
        album.setArtist(req.artist).done(function (err,album){
          if(err) {
            res.redirect('/dashboard');
          } else {
            res.render('/profile/:id', {album: req.album});
          }
      });
    });
  });

// app.get('/artist/:id', function(req, res) {
//   var id = artist.id;
//   console.log(id);
//   db.Artist.find(id).done(function(err,artist){
//     res.render('artists/artist_edit', {artist: artist});
//   });
// });


app.get('/messages', function(req, res){
  res.render('users/messages');
});





// app.post('/artist-submit', function(req, res){
//   db.Artist.createNewArtist(req.body.first_name, req.body.last_name, req.body.email_address, req.body.password,
//         function(err){
//           console.log("ERROR!");
//           console.log(err);
//           res.redirect('/', {message: err.message, email_address: req.body.email_address});
//         },
//         function(success){
//           console.log("GREAT SUCCESS!");
//           console.log(success);
//           res.redirect('/', {message: success.message});
//         }
//       );
//   // res.render('/');
// });


app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

app.get('*', function(req,res){
  res.status(404);
  res.render('404');
});

app.listen(process.env.PORT || 3000, function(){
  console.log("get this party started on port 3000");
});