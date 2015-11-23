var express = require('express'),
    router  = new express.Router();

// Require controllers.
var welcomeController = require('../controllers/welcome');
var usersController   = require('../controllers/users');
var circlesController = require('../controllers/circles');

// root path:
router.get('/', welcomeController.index);

// users resource paths:
router.get('/users',     usersController.index);
router.get('/users/:spotifyId', usersController.show);

// circles resource paths:
router.get('/circles', circlesController.index);

module.exports = router;
