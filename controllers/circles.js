var index = function(req, res, next) {
  res.render('circles/index');
};

module.exports = {
  index: index
};
