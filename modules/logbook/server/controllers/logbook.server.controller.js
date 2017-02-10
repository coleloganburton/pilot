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
  console.log(req.user._id);

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
  if (req.logbook && req.user && req.logbook.user.id === req.user.id){
    res.json(req.logbook);
  }
};

/**
 * Update a logbook
 */
exports.update = function (req, res) {
  var logbook = req.logbook;

  logbook.date = req.body.date;
  logbook.aircraftType = req.body.aircraftType;
  logbook.aircraftID = req.body.aircraftID;
  logbook.from = req.body.from;
  logbook.to = req.body.to;
  logbook.route = req.body.route;
  logbook.numberInstApp = req.body.numberInstApp;
  logbook.remarks = req.body.remarks;
  logbook.takeoffs = req.body.takeoffs;
  logbook.landings = req.body.landings;
  logbook.sel = req.body.sel;
  logbook.mel = req.body.mel;
  logbook.night = req.body.night;
  logbook.actualInstrument = req.body.actualInstrument;
  logbook.simInstrument = req.body.simInstrument;
  logbook.flightSimulator = req.body.flightSimulator;
  logbook.crossCountry = req.body.crossCountry;
  logbook.solo = req.body.solo;
  logbook.dualReceived = req.body.dualReceived;
  logbook.pic = req.body.pic;
  logbook.totalTime = req.body.totalTime;

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
  var userI = req.user.id; //grab User ID, use .find with param to only grab logs from that user
  Logbook.find({ user: { _id: userI } }).sort('-created').populate('user', 'displayName').exec(function (err, logbook) {
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
