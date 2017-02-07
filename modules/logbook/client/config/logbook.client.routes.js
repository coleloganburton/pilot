'use strict';

// Setting up route
angular.module('logbook').config(['$stateProvider',
  function ($stateProvider) {
    // logbook state routing
    $stateProvider
      .state('logbook', {
        abstract: true,
        url: '/logbook',
        template: '<ui-view/>'
      })
      .state('logbook.list', {
        url: '',
        templateUrl: 'modules/logbook/client/views/list-logbook.client.view.html'
      })
      .state('logbook.create', {
        url: '/create',
        templateUrl: 'modules/logbook/client/views/create-logbook.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('logbook.view', {
        url: '/:logbookId',
        templateUrl: 'modules/logbook/client/views/view-logbook.client.view.html'
      })
      .state('logbook.edit', {
        url: '/:logbookId/edit',
        templateUrl: 'modules/logbook/client/views/edit-logbook.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
