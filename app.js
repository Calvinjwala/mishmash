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
  var routeMiddleware = require("./config/routes");
  // var geocoderProvider = 'google';
  var httpAdapter = 'http';
  // var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter);


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
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
app.get('/', function(req, res){
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

app.post('/submit', function(req, res){
  db.User.createNewUser(req.body.firstName, req.body.lastName, req.body.emailAddress, req.body.password,
        function(err){
          console.log(err);
          res.redirect('/', {message: err.message, firstName: req.body.firstName});
        },
        function(success){
          console.log(success);
          res.redirect('/', {message: success.message});
        }
      );
  // res.render('/');
});

app.get('/search', function(req, res){
  res.render('search_results/search');
});

app.get('/dashboard', routeMiddleware.checkAuthentication, function(req, res){
  res.render('users/dashboard', {user: req.user});
});

app.get('/new-artist', function(req, res){
  res.render('artists/new_artist');
});


app.get('*', function(req,res){
  res.status(404);
  res.render('404');
});

app.listen(process.env.PORT || 3000, function(){
  console.log("get this party started on port 3000");
});