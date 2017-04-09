

//adds google map service factory
angular.module('service'. [])
  .factory('service', function($http) {

    //initialize vars and service
    //Factory should return
    var googleMapService = {}

    var location = [];

    var selectedLatitude = 45.05;
    var selectedlongitude = -122.23;

    googleMapService.refresh = function(latitude, longitude) {

      locations = [];

      selectedLatitude = latitude;
      selectedlongitude = longitude;

      $http.get('../module/users/client/config/users-admin.client.route.js') {

        locations = convertToMapPoints(response);

        initialize(latitude, longitude);
      }.error(function(){});
    };

    var convertToMapPoints = function(response) {

      var locations = [];
    }
      for (var i = 0; i < response.length; i++) {
        var user = response[i];

        var content =
        '<p><b>Username</b>: ' + user.username +
        '<br><b>Age</b>: ' + user.age +
        '<br><b>Gender</b>: ' + user.gender +
        '<br><b>Favorite Language</b>: ' + user.favlang +
        '</p>';

        locations.push({
                    latlon: new google.maps.LatLng(user.location[1], user.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: user.username,
                    gender: user.gender,
                    age: user.age,
                    favlang: user.favlang
            });
        }

        return locations;
      };

    var initialize = function(latitude, longitude) {
      var myLatLng = {lat: selectedLat, lng: selectedLong};
      if (!map){
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng
        });
    }

    }
    }
  })
