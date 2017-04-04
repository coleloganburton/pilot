'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * fltplan Schema
 */
var fltplanSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  route: {
    type: String,
    default: '',
    trim: true,
    required: 'Route cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Fltplan', fltplanSchema);
