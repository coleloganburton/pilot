'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Logbook = mongoose.model('Logbook'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a logbook
 */
exports.create = function (req, res) {
  var logbook = new Logbook(req.body);
  logbook.user = req.user;

  logbook.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(logbook);
    }
  });
};

/**
 * Show the current logbook
 */
exports.read = function (req, res) {
  var user = res.json(req.logbook.user);
//unique user
  if (user == req.user)
  {
    res.json(req.logbook)
  }
};

/**
 * Update a logbook
 */
exports.update = function (req, res) {
  var logbook = req.logbook;

  logbook.title = req.body.title;
  logbook.content = req.body.content;

  logbook.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(logbook);
    }
  });
};

/**
 * Delete an logbook
 */
exports.delete = function (req, res) {
  var logbook = req.logbook;

  logbook.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(logbook);
    }
  });
};

/**
 * List of logbook
 */
exports.list = function (req, res) {
  Logbook.find().sort('-created').populate('user', 'displayName').exec(function (err, logbook) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(logbook);
    }
  });
};

/**
 * logbook middleware
 */
exports.logbookByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Logbook is invalid'
    });
  }

  Logbook.findById(id).populate('user', 'displayName').exec(function (err, logbook) {
    if (err) {
      return next(err);
    } else if (!logbook) {
      return res.status(404).send({
        message: 'No logbook with that identifier has been found'
      });
    }
    req.logbook = logbook;
    next();
  });
};
