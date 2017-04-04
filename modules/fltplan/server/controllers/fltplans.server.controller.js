'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Fltplan = mongoose.model('Fltplan'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a fltplan
 */
exports.create = function (req, res) {
  var fltplan = new Fltplan(req.body);
  fltplan.user = req.user;

  fltplan.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fltplan);
    }
  });
};

/**
 * Show the current fltplan
 */
exports.read = function (req, res) {
  res.json(req.fltplan);
};

/**
 * Update a fltplan
 */
exports.update = function (req, res) {
  var fltplan = req.fltplan;

  fltplan.route = req.body.route;

  fltplan.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fltplan);
    }
  });
};

/**
 * Delete an fltplan
 */
exports.delete = function (req, res) {
  var fltplan = req.fltplan;

  fltplan.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fltplan);
    }
  });
};

/**
 * List of fltplans
 */
exports.list = function (req, res) {
  Fltplan.find().sort('-created').populate('user', 'displayName').exec(function (err, fltplans) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fltplans);
    }
  });
};

/**
 * fltplan middleware
 */
exports.fltplanByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'fltplan is invalid'
    });
  }

  Fltplan.findById(id).populate('user', 'displayName').exec(function (err, fltplan) {
    if (err) {
      return next(err);
    } else if (!fltplan) {
      return res.status(404).send({
        message: 'No fltplan with that identifier has been found'
      });
    }
    req.fltplan = fltplan;
    next();
  });
};
