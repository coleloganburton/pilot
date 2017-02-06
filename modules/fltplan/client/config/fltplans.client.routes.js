'use strict';

// Setting up route
angular.module('fltplans').config(['$stateProvider',
  function ($stateProvider) {
    // fltplans state routing
    $stateProvider
      .state('fltplan', {
        url: '/fltplan',
        templateUrl: 'modules/fltplan/client/views/fltplan.client.view.html'
      })
      .state('fltplans.list', {
        url: '',
        templateUrl: 'modules/fltplan/client/views/list-fltplans.client.view.html'
      })
      .state('fltplans.create', {
        url: '/create',
        templateUrl: 'modules/fltplan/client/views/create-fltplan.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('fltplans.view', {
        url: '/:fltplanId',
        templateUrl: 'modules/fltplan/client/views/view-fltplan.client.view.html'
      })
      .state('fltplans.edit', {
        url: '/:fltplanId/edit',
        templateUrl: 'modules/fltplan/client/views/edit-fltplan.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
