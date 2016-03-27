/**
 * @author Michael Rose
 * @license https://github.com/msrose/denote/blob/master/LICENSE
 */

/**
 * @module utils
 * @private
 */

'use strict';

/**
 * Checks if the given value is a function
 * @param {any} value The value to check
 * @returns {boolean} True if the given value is a function, false if not
 */
exports.isFunction = function(value) {
  return typeof value === 'function';
};

/**
 * Checks if the given value is an object.
 * @param {any} value The value to check
 * @returns {boolean} True if the the given value is an object and not null, false otherwise
 */
exports.isObject = function(value) {
  return value !== null && typeof value === 'object';
};
