/**
 * @author Michael Rose
 * @license https://github.com/msrose/denote/blob/master/LICENSE
 */

'use strict';

var utils = require('./utils');

/**
 * Implements the promise resolution procedure for the given type.
 * The promise adopts the state of its resolve value.
 * @private
 * @param {any} value The value that the promise is resolved with
 * @param {function} Type The constructor function of the promise type
 * to coerce. Just pass noop (i.e. function() {}) if you don't have a
 * constructor for your promises.
 * @param {function} fulfill Callback called with the final resolution
 * if coercion ends with fulfillment
 * @param {function} reject Callback called with a rejection reason
 * if coercion ends with rejection
 * @returns {undefined}
 */
module.exports = function coerce(value, Type, fulfill, reject) {
  if(value instanceof Type) {
    value.then(fulfill, reject);
  } else if(utils.isObject(value) || utils.isFunction(value)) {
    var called = false;
    try {
      var then = value.then;
      if(utils.isFunction(then)) {
        var resolveFunction = function(resolveValue) {
          if(!called) {
            called = true;
            coerce(resolveValue, Type, fulfill, reject);
          }
        };
        var rejectFunction = function(rejectValue) {
          if(!called) {
            called = true;
            reject(rejectValue);
          }
        };
        then.call(value, resolveFunction, rejectFunction);
      } else {
        fulfill(value);
      }
    } catch(e) {
      if(!called) {
        reject(e);
      }
    }
  } else {
    fulfill(value);
  }
};
