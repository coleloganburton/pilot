'use strict';

// Logbook controller
angular.module('logbook').controller('LogbookController', ['$scope', '$stateParams', '$location', 'Authentication', 'Logbook',
  function ($scope, $stateParams, $location, Authentication, Logbook) {
    $scope.authentication = Authentication;

    // Create new logbook
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'logbookForm');

        return false;
      }

      // Create new logbook object
      var logbook = new Logbook({
        date: this.date,
        aircraftType: this.aircraftType.toUpperCase(),
        aircraftID: this.aircraftID.toUpperCase(),
        from: this.from.toUpperCase(),
        to: this.to.toUpperCase(),
        route: this.route.toUpperCase(),
        numberInstApp: this.numberInstApp,
        remarks: this.remarks,
        takeoffs: this.takeoffs,
        landings: this.landings,
        sel: this.sel,
        mel: this.mel,
        night: this.night,
        actualInstrument: this.actualInstrument,
        simInstrument: this.simInstrument,
        flightSimulator: this.flightSimulator,
        crossCountry: this.crossCountry,
        solo: this.solo,
        dualReceived: this.dualReceived,
        pic: this.pic,
        totalTime: this.totalTime
      });

      // Redirect after save
      logbook.$save(function (response) {
        $location.path('logbook/' + response._id);

        // Clear form fields
        $scope.date = '';
        $scope.aircraftType = '';
        $scope.aircraftID = '';
        $scope.from = '';
        $scope.to = '';
        $scope.route = '';
        $scope.numberInstApp = '';
        $scope.remarks = '';
        $scope.takeoffs = '';
        $scope.landings = '';
        $scope.sel = '';
        $scope.mel = '';
        $scope.night = '';
        $scope.actualInstrument = '';
        $scope.simInstrument = '';
        $scope.flightSimulator = '';
        $scope.crossCountry = '';
        $scope.solo = '';
        $scope.dualReceived = '';
        $scope.pic = '';
        $scope.totalTime = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing logbook
    $scope.remove = function (logbook) {
      if (logbook) {
        logbook.$remove();

        for (var i in $scope.logbook) {
          if ($scope.logbook[i] === logbook) {
            $scope.logbook.splice(i, 1);
          }
        }
      } else {
        $scope.logbook.$remove(function () {
          $location.path('logbook');
        });
      }
    };

    // Update existing logbook
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'logbookForm');

        return false;
      }

      var logbook = $scope.logbook;

      logbook.$update(function () {
        $location.path('logbook/' + logbook._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Logbook
    $scope.find = function () {
      $scope.logbook = Logbook.query();
    };

    // Find existing logbook
    $scope.findOne = function () {
      $scope.logbook = Logbook.get({
        logbookId: $stateParams.logbookId
      });
    };
  }
]);
