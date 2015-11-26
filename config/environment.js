var _ = require('lodash');

var localEnvVars = {
  TITLE:      'piradio',
  SAFE_TITLE: 'piradio'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
