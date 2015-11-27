var User = require('../models/user');
var Circle = require('../models/circle');
var spotify = require('../config/spotifyApiHelper');
var locus = require('locus');

var addCircleUsers = function(req, res, done){
  User.findOne(req.body, function(err, user) {
    if (err) return done(err);
    if (user) {
      res.json(user);
    } else {
      var newUser = new User({
        spotifyId: req.query.spotifyId,
        circles: []
      });
      newUser.save(function(err, user) {
        if (err) return done(err);
        res.json(user);
      });
    }
  });
};


var indexCircle = function(req, res) {
  Circle.find({}, function(err, records) {
    res.json(records);
  });
};

var createCircle = function(req, res) {
  var circle = new Circle(req.body);
  circle.creator = req.user._id;
  circle.users.push(req.user._id);
  circle.save(function(err){
    if (err) res.send(err);
    res.json(circle);
  });
};

var updateCircle = function(req, res) {
  req.record.set(req.body);
  req.record.save(function (err, record) {
    res.json(record);
  });
};

var destroyCircle = function(req, res) {
  req.record.remove(function (err, record) {
    res.json(record);
  });
};

module.exports = {
  addCircleUsers: addCircleUsers,
  indexCircle: indexCircle,
  createCircle: createCircle,
  updateCircle: updateCircle,
  destroyCircle: destroyCircle
}
