console.log('JS loaded!');

var userId;
var friendsToAdd = [];
var friendId;

$(document).ready(function() {

  var circles   = _.template($('#circles-template').html());
  var $destination  = $('main');

  $destination.append(circles);

  var filteredUsers = [],
      searchName    = '';


  var buildUri = function(nameInput) {
      var baseUri = 'https://api.spotify.com/v1/users/';

      var searchParam = nameInput
                        .split(",")
                        .map(function(str){
                          return encodeURIComponent(str.trim());
                        });
      return baseUri + searchParam
    }



    function doSearch(currentSearch){

    $.ajax({
      type: 'GET',
      url: buildUri(currentSearch),
      error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.status);
      console.log(textStatus);
      console.log(errorThrown);
      $('#friend').empty();
      $('#friend').append('<p>No users match that ID</p>');
    },
      success: function(data){
        console.log(data);
        foundUser = data;
        if (foundUser.images.length > 0) {
          profileImage = foundUser.images[0].url;
        } else {
          profileImage = null;
        }

        if (profileImage) {
          $('#friend').append('<div id="proImg">');
          $('#proImg').css('background-image', 'url(' + profileImage + ')');
        } else {
          $('#friend').append('<div id="proImg">');
          $('#proImg').css('background-image', 'url(http://www.sessionlogs.com/media/icons/defaultIcon.png)');
        }


        if(foundUser.display_name) {
          $('#friend').append(foundUser.display_name);
        } else {
          $('#friend').append(foundUser.id);
        }
        $('#friend').append('<input type="submit" id="addToCircle" value="Add Friend">');
        $('#addToCircle').on('click', function(){
              var friend = $('#friend div').html();
              $('#circleMembers').append('<li class="addedFriend" id="'+foundUser.id+'">'+foundUser.display_name+'</li>');
              $('#friend').empty();
          });
      }
    });
  }

  $('#search').on('keyup blur', function(evt) {
    var currentSearch = $('#search').val();
      $('#friend').empty();
      doSearch(currentSearch);

    // if (evt.keyCode === 13) {
    //   $('#friend').empty();
    //   doSearch(currentSearch);
    // } else {
    //   $('#friend').empty();
    //   doSearch(currentSearch);
    // }
  });

  var title = $('#titleField').val();

  $('#createCircle').on('click', function(){
    $.each($('.addedFriend'), function(i, friend){
      friendId = $(friend).attr('id');
      $.post('/users', {spotifyId: friendId},
        function(data){
          var newId = data._id;
          friendsToAdd.push(newId);
          console.log(friendsToAdd);
        });
    });
  });

  // $.post('/circles', {title: title, users: friendsToAdd}, function(data){console.log(data);}, function(err){console.log(err);});




});
