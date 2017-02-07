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
        title: this.title,
        content: this.content
      });

      // Redirect after save
      logbook.$save(function (response) {
        $location.path('logbook/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
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

  //  $scope.user == Authentication.user;
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
