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
  // var geocoderProvider = 'google';
  var httpAdapter = 'http';
  // var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter);


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

// landing page //
app.get('/', routeMiddleware.preventLoginSignup, function(req, res){
//   db.User.create({first_name: "billy", last_name: "bob"}).success(function(user){
//     console.log("created user", user);
//     db.Artist.create({artist_name: "stones", city: "london"}).success(function(artist){
//       console.log("artist created!");
//       user.setArtist(artist).success(function(artist){
//         // console.log("set!");
//         console.log(artist);
//         db.Album.create({title: "40 licks"}).success(function(album){
//           artist.setAlbums([album]).success(function(){
//             console.log("set!");
//           });
//         });
//       });
//     });
//   });
// });
  res.render('index');
});


// LOG IN
// app.post('/', routeMiddleware.checkAuthentication, function(req,res){
//   console.log("works... kinda");
//   console.log(req.user);
//     res.render('users/dashboard', {message: req.flash('loginMessage'), error: req.flash('error'), email_address:""});
// });

// app.get('/login', routeMiddleware.preventLoginSignup, function(req,res){
//   res.render('users/dashboard');
// });

// authenticate users when logging in - no need for req,res passport does this for us -done
app.post('/login', passport.authenticate('local',{
  successRedirect: '/dashboard',
  failureRedirect: '/',
  failureFlash: true
}));


// routeMiddleware.preventLoginSignup
// SIGN UP
app.post('/submit', function(req, res){
  db.User.createNewUser(req.body.first_name, req.body.last_name, req.body.email_address, req.body.password,
        function(err){
          console.log("ERROR!");
          console.log(err);
          res.redirect('/');//, {message: err.message, email_address: req.body.email_address});
        },
        function(success){
          res.alert("GREAT SUCCESS!");
          console.log(success);
          res.redirect('/');//, {message: success.message});
        }
      );
});



app.get('/search', function(req, res){
  res.render('search_results/search');
});

// DASHBOARD FOR USER
// DEPLOY BELOW ONCE login works
// app.get('/dashboard', routeMiddleware.checkAuthentication, function(req, res){
//   res.render('users/dashboard', {user: req.user});
// });

app.get('/dashboard', routeMiddleware.checkAuthentication, function(req, res){
  res.render('users/dashboard', {user: req.user});
});


// LINK TO BECOME AN ARTIST
// need to make it disappear once they are officially artists
app.get('/new-artist', function(req, res){
  res.render('artists/new_artist');
});

// USER PROFILE
// DEPLOY BELOW ONCE login works
app.get('/my_profile', function(req,res){
  db.User.find(req.user.id).done(function(err, user){
    res.render('users/user_profile', {user:req.user});
    });
  });
// app.get('/my_profile', function(req,res){
//   res.render('users/user_profile');
// });


app.get('/messages', function(reqs, res){
  res.render('users/messages');
});


// app.get('/search', function(req,res){
//   db.Artist.findAll().done(function(err, artists){
//     var coords = artist.map(function (artist) {
//       return {name: user.first_name, location: artist.zip_code, category:user.category};
//     });
//     res.render('search_results/search', {userInfo: JSON.stringify(coords)});
//   });
// });
app.get('/search', function(req,res){
    res.render('search_results/search');
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
  //req.logout added by passport - delete the user id/session
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