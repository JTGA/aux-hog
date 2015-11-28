var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    debug    = require('debug')('app:models');

var spotify = require('../config/spotifyApiHelper');

var userSchema = new Schema({
  displayName: String,
  email: String,
  spotifyId: String,
  profileImage: String,
  created: { type: Date, default: Date.now },
  circles: Array
});

userSchema.methods.getPlaylists = function(callback) {
  spotify.getPlaylists(this.spotifyId, callback);
}

var User = mongoose.model('User', userSchema);

module.exports = User;


/*


User.findOne(..., function(u) {
  u.getPlaylists(function(playlists) {
    res.render()
  })
})



*/


// {
//  "display_name" : "Lilla Namo",
//  "external_urls" : {
//    "spotify" : "https://open.spotify.com/user/tuggareutangranser"
//  },
//  "followers" : {
//    "href" : null,
//    "total" : 4561
//  },
//  "href" : "https://api.spotify.com/v1/users/tuggareutangranser",
//  "id" : "tuggareutangranser",
//  "images" : [ {
//    "height" : null,
//    "url" : "http://profile-images.scdn.co/artists/default/d4f208d4d49c6f3e1363765597d10c4277f5b74f",
//    "width" : null
//  } ],
//  "type" : "user",
//  "uri" : "spotify:user:tuggareutangranser"
// }

// in Passport (either serialze or deserialze...):

// displayName = response.display_name
// spotifyId = response.id
// profileImage = response.images[0].url
