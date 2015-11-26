var request = require('request'),
    async   = require('async');

var Circle = require('../models/circle');

function buildPlaylistUri(userId) {
  return `https:\/\/api.spotify.com/v1/users/${userId}/playlists`
}

function buildTracklistUri(playlistId, userId) {
  return `https:\/\/api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
}

module.exports = {

  buildPlaylistUri: buildPlaylistUri,
  buildTracklistUri: buildTracklistUri,

  getPlaylists: function(userId, token, callback) {
    var options = {
      url: buildPlaylistUri(userId),
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + token
      },
      json: true
    };
    request(options, function(err, response, playlists) {
      callback(playlists);
    });
  },

  getTracks: function(playlistId, userId, token, callback) {
    var options = {
      url: buildTracklistUri(playlistId, userId),
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer " + token
      },
      json: true
    };
    request(options, function(err, body, tracklist){
      callback(tracklist);
    });
  },

  buildLibraries: function(circleId, accessToken) {
    var self = this;
    var iter = 0;

    var libraries = [];
    Circle.findById(circleId).populate('users').exec(function(err, circle) {
      console.log(circle);

      circle.users.forEach(function(user){
        var userLib = {
          name: user.displayName,
          tracks: [],
        };

        console.log('user: ', user.spotifyId);
        self.getPlaylists(user.spotifyId, accessToken, function(playlists){
          if (playlists.error) console.log(playlists.error.message);

          console.log('parsing playlists; loaded:', playlists.items.length);

          async.each(playlists.items, function(playlist, nextPlaylist) {
            console.log('playlist:', iter, playlist.name);
            iter++;
            if (playlist.owner.id === user.spotifyId) {

              self.getTracks(playlist.id, user.spotifyId, accessToken, function(tracks){

                tracks.items.forEach(function(track){
                  track.playlistName = playlist.name;
                  userLib.tracks.push(track);
                });

                console.log('  tracks loaded!');
                nextPlaylist();
              }); // tracks
            } else {
              console.log('  skipped playlist…')
              nextPlaylist();
            } // end the if statement
          }, function(err) {
            if (err) console.log(err);
            console.log('all user\'s playlists loaded');
            libraries.push(userLib);
            console.log("LIBRARIES:", libraries.length);
            libraries.forEach(function(library) {
              console.log(library.name + " " + library.tracks.length)
            });
          }); // each playlist
        }); // all playlists

      }); // each user
    }); // all users

    return libraries;
  }

}
