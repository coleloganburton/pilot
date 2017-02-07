'use strict';

// Configuring the logbook module
angular.module('logbook').run(['Menus',
  function (Menus) {
    // Add the logbook dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Logbook',
      state: 'logbook.list',
      type: 'item',
      position: 2
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'logbook', {
      title: 'List Logbook',
      state: 'logbook.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'logbook', {
      title: 'Create Articles',
      state: 'logbook.create',
      roles: ['user']
    });
  }
]);
