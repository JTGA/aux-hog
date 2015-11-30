console.log('main.js loaded!');

$(document).ready(function() {

  var circles   = _.template($('#circles-template').html()),
      $destination  = $('main'),
      friendsToAdd = [],
      filteredUsers = [],
      searchName    = '',
      userId,
      friendId;

  // =============Templating=============
  // ====================================

  $destination.append(circles);
  function circleView(){

  }

  // ================Main================
  // ====================================


  function buildUri(nameInput) {
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
  });

  $('#createCircle').on('click', function(){
    var title = $('#titleField').val();
    $.each($('.addedFriend'), function(i, friend){
      friendId = $(friend).attr('id');
      friendsToAdd.push(friendId);
    });
    $.ajax({
      url: '/circles',
      type: 'POST',
      data: {
        users: JSON.stringify(friendsToAdd),
        title: title,
      },
      success: function(data){
        // new CircleView(data);
        console.log(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.status);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  });


  $('#circlesList').delegate('.stationLink', 'click', function(evt){
    evt.preventDefault();
    var id = $(this).attr('id');
    console.log(id);
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/testLib',
      data: {
        disId: id
      },
      success: function(data) {
        console.log(data);
        $('#spotifyPlayer').append('<iframe src="https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + data + '" frameborder="0" allowtransparency="true"></iframe>');
      },
      error: function() {
        console.log('herb')
      }
    });
  });

  $('#circlesList').delegate('.deleteCircle', 'click', function(evt){
        var id = $(this).attr('id');
        $('#' + id).remove();
        $.ajax({
          method: 'DELETE',
          url: '/circles/' + id
        }).done(function(data) {
          console.log(data);
        });
      });

});


