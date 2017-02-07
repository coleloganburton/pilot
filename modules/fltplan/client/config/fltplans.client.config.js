'use strict';

// Configuring the fltplans module
angular.module('fltplans').run(['Menus',
  function (Menus) {
    // Add the fltplans dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Flight Plan',
      state: 'fltplan',
      position: 1
    });
    /*
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'fltplans', {
      title: 'List fltplans',
      state: 'fltplans.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'fltplans', {
      title: 'Create fltplans',
      state: 'fltplans.create',
      roles: ['user']
    });
    */
  }
]);
