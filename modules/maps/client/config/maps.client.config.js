'use strict';

angular.module('maps').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'maps',
      state: 'maps.search',
      type: 'item',
      position: 3
    });
  }
]);
