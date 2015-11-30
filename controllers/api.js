var User = require('../models/user');
var Circle = require('../models/circle');
var spotify = require('../config/spotifyApiHelper');
var locus = require('locus');

var indexCircle = function(req, res) {
  Circle.find({}, function(err, records) {
    res.json(records);
  });
};

var showCircle = function(req, res){
  var id = req.params.id;
  Circle.findById(id, function(err, circle){
    console.log("GOT TO THIS");
    if (err) {
      res.send(err);
    }
    res.json(circle);
  });
};

var findCircle = function(req, res) {
  Circle.find({'_id': req.query._id }, function(err, record) {
    res.json(record);
  })
};

var indexUser = function(req, res) {
  User.find({}, function(err, records) {
    res.json(records);
  });
};

var displayCircleUsers = function(req, res) {

}

module.exports = {
  indexCircle: indexCircle,
  showCircle: showCircle,
  findCircle: findCircle,
  indexUser: indexUser,
  displayCircleUsers: displayCircleUsers
}
