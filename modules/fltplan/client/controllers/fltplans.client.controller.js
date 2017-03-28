'use strict';

// fltplans controller
angular.module('fltplans').controller('fltplansController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'fltplans',
  function ($scope, $http, $stateParams, $location, Authentication, fltplans) {

    $scope.authentication = Authentication;

    //build URL
    //encodeURIComponent will not encode ~!*()'
    //escape will not encode @*/+
    var yahoo = 'https://query.yahooapis.com/v1/public/yql?q=';
    var select = "select%20*%20from%20html%20where%20url%3D'";
    var queryURL = encodeURIComponent("https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=");
    var extra = "%26hoursBeforeNow%3D2";
    var format = "'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    //var testURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'https%3A%2F%2Faviationweather.gov%2Fadds%2Fdataserver_current%2Fhttpparam%3FdataSource%3Dmetars%26requestType%3Dretrieve%26format%3Dxml%26stationString%3DKDEN%2520KSEA%2C%2520PHNL%26hoursBeforeNow%3D2'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    //try encoding urls

    $scope.submit = function () {
      var RequestURL = yahoo + select + queryURL + encodeURIComponent($scope.route) + extra + format;

      //GET METARs from YQL
      $http.get(RequestURL)
    .success(function(data){
      //console.log(data);
      //console.log(data.query.results.body.response.data_source.request.errors.warnings.data.metar);
      $scope.metars = data.query.results.body.response.data_source.request.errors.warnings.data.metar;

      $scope.flightConditions = function (metar) {
        if(metar.sky_condition.flight_category){
          return metar.sky_condition.flight_category;
        }
        else if (metar.sky_condition.sky_condition) {
          return metar.sky_condition.sky_condition.flight_category;
        }
        else {
          return 'Flight conditions error';
        }
      };

      $scope.time = function (time) {
        var date = new Date(time);
        return date.toString();
      };

      $scope.convertToF = function (c) {
        return ((c*(9/5))+32).toFixed(1);
      };

      $scope.altim = function (altim) {
        return Number(altim).toFixed(2);
      };

      $scope.humidity = function (metar) {
        var t = Number(metar.temp_c),
          d = Number(metar.dewpoint_c);
        var top = Math.exp((17.625*d)/(243.04+d));
        var btm = Math.exp((17.625*t)/(243.04+t));
        return (100*(top/btm)).toFixed(0);
      };


    /*
    $scope.density_altitude = function (metar) {
    };
    */



    });
    };
    //Make input
    //vlaidate input
    //submit request
    //parse request
    //display request, repeat based on number of input




/*
    // Create new fltplan
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'fltplanForm');

        return false;
      }

      // Create new fltplan object
      var fltplan = new Fltplans({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      fltplan.$save(function (response) {
        $location.path('fltplans/' + response._id);
        console.log('HERE YO');
        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing fltplan
    $scope.remove = function (fltplan) {
      if (fltplan) {
        fltplan.$remove();

        for (var i in $scope.fltplans) {
          if ($scope.fltplans[i] === fltplan) {
            $scope.fltplans.splice(i, 1);
          }
        }
      } else {
        $scope.fltplan.$remove(function () {
          $location.path('fltplans');
        });
      }
    };

    // Update existing fltplan
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'fltplanForm');

        return false;
      }

      var fltplan = $scope.fltplan;

      fltplan.$update(function () {
        $location.path('fltplans/' + fltplan._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of fltplans
    $scope.find = function () {
      $scope.fltplans = Fltplans.query();
    };

    // Find existing fltplan
    $scope.findOne = function () {
      $scope.fltplan = Fltplans.get({
        fltplanId: $stateParams.fltplanId
      });
    };
    */
  }
]);
