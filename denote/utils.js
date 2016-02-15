/**
 * Author: Michael Rose
 * License: MIT
 */

'use strict';

exports.isFunction = function(value) {
  return typeof value === 'function';
};

exports.isObject = function(value) {
  return value !== null && typeof value === 'object';
};

exports.states = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
};
