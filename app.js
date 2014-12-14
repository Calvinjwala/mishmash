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
  // var routeMiddleware = require("./config/routes");
  // var geocoderProvider = 'google';
  // var httpAdapter = 'http';
  // var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter);


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}) );
app.use(methodOverride('_method'));

app.get('/', function(req, res){
  res.render('index');
});

app.get('*', function(req,res){
res.status(404);
res.render('404');
});

app.listen(process.env.PORT || 3000, function(){
  console.log("get this party started on port 3000");
});