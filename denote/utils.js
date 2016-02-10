'use strict';

exports.isFunction = function(value) {
  return typeof value === 'function';
};

exports.isObject = function(value) {
  return value !== null && typeof value === 'object';
};

exports.once = function(callback) {
  var called = false;
  return function() {
    if(!called) {
      callback.apply(this, arguments);
      called = true;
    }
  };
};
