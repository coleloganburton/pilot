'use strict';

angular.module('maps').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Maps',
      state: 'maps',
      type: 'item',
      position: 3
    });
  }
]);
