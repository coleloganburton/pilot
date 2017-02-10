'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Logbook Schema
 */
var LogbookSchema = new Schema({
  date: {
    type: Date
  },
  aircraftType: {
    type: String,
    default: '',
    trim: true,
    required: 'Aircraft type cannot be blank'
  },
  aircraftID: {
    type: String,
    default: '',
    trim: true,
    required: 'Aircraft ID cannot be blank'
  },
  from: {
    type: String,
    default: '',
    trim: true
  },
  to: {
    type: String,
    default: '',
    trim: true
  },
  route: {
    type: String,
    default: '',
    trim: true
  },
  numberInstApp: {
    type: Number,
    default: 0,
    trim: true
  },
  remarks: {
    type: String,
    default: 'None',
    trim: true
  },
  takeoffs: {
    type: Number,
    default: 0,
    trim: true
  },
  landings: {
    type: Number,
    default: 0,
    trim: true
  },
  sel: {
    type: Number,
    default: 0,
    trim: true
  },
  mel: {
    type: Number,
    default: 0,
    trim: true
  },
  night: {
    type: Number,
    default: 0,
    trim: true
  },
  actualInstrument: {
    type: Number,
    default: 0,
    trim: true
  },
  simInstrument: {
    type: Number,
    default: 0,
    trim: true
  },
  flightSimulator: {
    type: Number,
    default: 0,
    trim: true
  },
  crossCountry: {
    type: Number,
    default: 0,
    trim: true
  },
  solo: {
    type: Number,
    default: 0,
    trim: true
  },
  dualReceived: {
    type: Number,
    default: 0,
    trim: true
  },
  pic: {
    type: Number,
    default: 0,
    trim: true
  },
  totalTime: {
    type: Number,
    default: 0,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Logbook', LogbookSchema);
