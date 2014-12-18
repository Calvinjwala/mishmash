var routeMiddleware = {
  checkAuthentication: function(req, res, next) {
    if (!req.user) {
      res.render('login', {message: "Please log in first"});
    }
    else {
     return next();
    }
  },

  preventLoginSignup: function(req, res, next) {
    if (req.user) {
      res.redirect('/dashboard');
    }
    else {
     return next();
    }
  },

    preventMultipleArtists: function(req, res, next) {
    if (req.user.artist) {
      res.redirect('/artist');
    }
    else {
     return next();
    }
  }
};
module.exports = routeMiddleware;