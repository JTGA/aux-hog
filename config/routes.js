var express     = require('express'),
    router      = new express.Router(),
    querystring = require('querystring'),
    passport    = require('passport');


// Require controllers.
var welcomeController = require('../controllers/welcome');
var circlesController = require('../controllers/api');

// root path:
router.get('/', welcomeController.index);

router.post('/circles', circlesController.createCircle);

router.post('/users', circlesController.addCircleUsers);

router.get('/libraries',function(req,res) {
//  eval(locus);
  var spotify = require('./spotifyApiHelper');
  var Circle = require('../models/circle');
  Circle.find({}, function(err, circles) {
    var libraries = spotify.buildLibraries(circles[0].id, req.user.accessToken);
    // console.log(libraries);
    res.json(libraries);
  });
});

// Spotify Login:
var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';

  // router.get('/', function(req,res){
  //   res.render('index', { title: "WELCOME TO BOOMSQUAD!"});

  // });

  router.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri: 'http://localhost:3000/callback',
      state: state
    }));
});

router.get('/auth/spotify',
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'], showDialog: true }),
  function(req, res){
   // The request will be redirected to spotify for authentication, so this
   // function will not be called.
});


router.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) {
    return next();
  } else {
    res.redirect('/');
  }
}

module.exports = router;
