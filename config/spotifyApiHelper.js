var request = require('request'),
    async   = require('async');
var Circle = require('../models/circle');

var locus = require('locus');
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
    return new Promise(function(resolve, reject) {
      Circle.findById(circleId).populate('users').exec(function(err, circle) {
        var circlePromises = circle.users.map(function(user){
          var userLib = {
            name: user.displayName,
            tracks: [],
          };
          return new Promise(function(resolve, reject) {
            self.getPlaylists(user.spotifyId, accessToken, function(playlists){
              if (playlists.error) {
                reject(playlists.error.message);
                return;
              };
              var trackPromises = playlists.items.map(function(playlist) {
                if (playlist.owner.id === user.spotifyId) {
                  return new Promise(function(resolve, reject) {
                    self.getTracks(playlist.id, user.spotifyId, accessToken, function(tracks){
                      tracks.items.forEach(function(track){
                        track.playlistName = playlist.name;
                        userLib.tracks.push(track);
                      });
                      resolve();
                    }); // tracks
                  });
                } // end the if statement
              }).filter(function(val){
                return val !== undefined;
              });
              Promise.all(trackPromises).then(function(value) {
                value.push(userLib);
                resolve(userLib);
              });
            }); // all playlists
          });
        }); // each user
        Promise.all(circlePromises).then(function(libraries) {
          // console.log('**********************************');
          // console.log(libraries);
          // console.log('**********************************');
          resolve(libraries);
        }, function(thang) {
          console.log(thang);
        });
      }); // all users
    });
  },
  buildStation: function(circleId, accessToken) {
    self = this;
    var p1 = new Promise(function(resolve, reject) {
      var libraryPromise = self.buildLibraries(circleId, accessToken);
      // console.log(libraryPromise);
      // setTimeout(function(){console.log(libraryPromise)}, 2000);
      libraryPromise.then(function(libraries) {
        var pullTracksResult = pullTracks(libraries);
        // console.log(libraries, pullTracksResult);
        resolve(pullTracksResult);
      }, function(thing) {
        console.log(thing);
      });
    });
    function pullTracks(userLibs) {
      // eval(locus);
      var masterPlaylist = [];
      for (var i = 0; i < 10; i++) {
        for (var x = 0; x < userLibs.length; x++) {
          var nextTrack = userLibs[x].tracks[Math.floor(Math.random()*userLibs[x].tracks.length)];
          if (nextTrack.track.id === null) {
            while (nextTrack.track.id === null) {
              nextTrack = userLibs[x].tracks[Math.floor(Math.random()*userLibs[x].tracks.length)];
              // masterPlaylist.push(userLibs[x].name, nextTrack.track.id);
              masterPlaylist.push(nextTrack.track.id);
              console.log(nextTrack.track.name);
            }
          } else {
              // masterPlaylist.push(userLibs[x].name, nextTrack.track.id);
              masterPlaylist.push(nextTrack.track.id);
              console.log(nextTrack.track.name);
          }
        };
      };
      return masterPlaylist.join();
    };
    return p1;
  }
}
