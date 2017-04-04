'use strict';

// Setting up route
angular.module('maps').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('maps', {
        abstract: true,
        url: '/maps',
        template: '<ui-view/>'
      })
      .state('maps.search', {
        url: '',
        templateUrl: 'modules/maps/client/views/search-maps.client.view.html'
      })
      .state('maps.view', {
        url: '/:mapsId',
        templateUrl: 'modules/maps/client/views/view-maps.client.view.html'
      })
      .state('maps.save', {
        url: '/:mapsId/edit',
        templateUrl: 'modules/maps/client/views/save-maps.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
