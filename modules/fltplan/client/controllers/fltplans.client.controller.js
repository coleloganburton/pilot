'use strict';

// fltplans controller
angular.module('fltplans').controller('fltplansController', ['$scope', '$stateParams', '$location', 'Authentication', 'fltplans',
  function ($scope, $stateParams, $location, Authentication, Fltplans) {
    $scope.authentication = Authentication;

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
  }
]);
