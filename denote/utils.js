/**
 * Author: Michael Rose
 * License: https://github.com/msrose/denote/blob/master/LICENSE
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
