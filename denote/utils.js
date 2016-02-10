'use strict';

exports.isFunction = function(value) {
  return typeof value === 'function';
};

exports.isObject = function(value) {
  return value !== null && typeof value === 'object';
};
