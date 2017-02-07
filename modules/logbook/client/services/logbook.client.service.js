'use strict';

//logbook service used for communicating with the logbook REST endpoints
angular.module('logbook').factory('Logbook', ['$resource',
  function ($resource) {
    return $resource('api/logbook/:logbookId', {
      logbookId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
