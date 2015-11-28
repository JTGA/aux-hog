// var mongoose = require('mongoose');

// var env = require('dotenv').load()

// mongoose.connect(process.env.DATABASE_URL);

// module.exports = mongoose;


var mongoose = require('mongoose');

var env = require('./environment');

// Use different database URIs based on whether an env var exists.
var dbUri = env.DATABASE_URL ||
            'mongodb://localhost/' + env.SAFE_TITLE;

if (!env.DATABASE_URL) {
  // check that MongoD is running...
  require('net').connect(27017, 'localhost').on('error', function() {
    console.log("YOU MUST BOW BEFORE THE MONGOD FIRST, MORTAL!");
    process.exit(0);
  });


mongoose.connect(dbUri);

module.exports = mongoose;
