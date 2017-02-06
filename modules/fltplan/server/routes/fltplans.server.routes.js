'use strict';

/**
 * Module dependencies.
 */
var fltplansPolicy = require('../policies/fltplans.server.policy'),
  fltplans = require('../controllers/fltplans.server.controller');

module.exports = function (app) {
  // fltplans collection routes
  app.route('/api/fltplans').all(fltplansPolicy.isAllowed)
    .get(fltplans.list)
    .post(fltplans.create);

  // Single fltplan routes
  app.route('/api/fltplans/:fltplanId').all(fltplansPolicy.isAllowed)
    .get(fltplans.read)
    .put(fltplans.update)
    .delete(fltplans.delete);

  // Finish by binding the fltplan middleware
  app.param('fltplanId', fltplans.fltplanByID);
};
