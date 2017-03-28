'use strict';

//fltplans service used for communicating with the fltplans REST endpoints


angular.module('fltplans').factory('fltplans', ['$resource',
  function ($resource) {
    return $resource('api/fltplans/:fltplanId', {
      fltplanId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

/*
angular.module('fltplans').factory('fltplans', function($http){
  delete $http.defaults.headers.common['X-Requested-With'];
  this.getData = function() {
  // $http() returns a $promise that we can add handlers with .then()
    return $http({
      method: 'GET',
      url: 'https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=KDEN%20KSEA,%20PHNL&hoursBeforeNow=2'
    });
  };
  console.log($http);
});
*/
