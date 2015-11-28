var User = require('../models/user');
var Circle = require('../models/circle');
var spotify = require('../config/spotifyApiHelper');
var locus = require('locus');
var async = require('async');

var addCircleUsers = function(req, res, done){
  User.findOne(req.body, function(err, user) {
    if (err) return done(err);
    if (user) {
      res.json(user);
    } else {
      var newUser = new User({
        spotifyId: req.body.spotifyId,
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

var createCircle = function(req, res, done) {
  var circle = new Circle(req.body);
  circle.creator = req.user._id;
  circle.users.push(req.user._id);
  var userArray = JSON.parse(req.body.users);
  async.each(userArray, function(user){
    circle.users.push(user);
  });
    circle.save(function(err){
      if (err) return done(err);
      console.log("that shit SAVED.");
    });

  // var circle = Circle.create(req.body, function(err, newCircle){
  //   var userArray = JSON.parse(req.body.users);
  //   userArray.forEach(function(user){
  //   eval(locus);
  //     newCircle.users.push(user)
  //   });
  //   circle.creator = req.user._id;
  //   circle.users.push(req.user._id);
    // async.each(userArray, function(user){
    //   circle.users.push(user);
    // });




  async.each(circle.users, function(user){
    User.findOne({ '_id': user }, function(err, user) {
      if (err) return done(err);
      if (user) {
        foundUser = user;
        foundUser.circles.push(circle);
        foundUser.save(function(err){
          if (err) return done(err);
        });
        console.log(foundUser);
      }
    });
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
