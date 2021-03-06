// Require resource's model(s).
var User = require("../models/user");

var index = function(req, res, next){

  User.find({}, function(error, users){
    res.render(
      'users/index', {users: users}
      // users
    );
  });
};

var show = function(req, res, next){
  User.find({spotifyId: req.params.spotifyId}, function(error, user){
    if (error) res.json({message: 'Could not find user because ' + error});
    res.render('users/show', {user: user});
  });
};

module.exports = {
  index: index,
  show:  show
};
