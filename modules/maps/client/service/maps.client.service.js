angular.module('service'. [])
  .factory('service', function($http) {
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

      }
    }
  })
