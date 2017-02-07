'use strict';

/**
 * Module dependencies.
 */
var logbookPolicy = require('../policies/logbook.server.policy'),
  logbook = require('../controllers/logbook.server.controller');

module.exports = function (app) {
  // logbook collection routes
  app.route('/api/logbook').all(logbookPolicy.isAllowed)
    .get(logbook.list)
    .post(logbook.create);

  // Single logbook routes
  app.route('/api/logbook/:logbookId').all(logbookPolicy.isAllowed)
    .get(logbook.read)
    .put(logbook.update)
    .delete(logbook.delete);

  // Finish by binding the logbook middleware
  app.param('logbookId', logbook.logbookByID);
};
