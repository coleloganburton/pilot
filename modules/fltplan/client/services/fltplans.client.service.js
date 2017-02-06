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
