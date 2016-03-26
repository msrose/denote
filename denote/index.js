/**
 * @author Michael Rose
 * @license https://github.com/msrose/denote/blob/master/LICENSE
 * @module denote
 */

'use strict';

var Denote = require('./denote');
var utils = require('./utils');

/**
 * @callback executor
 * @param {function} resolve A function that when called with a value,
 * will fulfill the promise with that value
 * @param {function} reject A function that when called with a reason,
 * will reject the promise with that reason
 */

/**
 * A factory function creating a new Denote promise instance.
 * @public
 * @since 1.2.0
 * @param {executor} [executor] An optional executor function that
 * will be called immediately.
 * @returns {Denote} A new Denote promise instance
 */
function denote(executor) {
  var promise = new Denote();
  if(utils.isFunction(executor)) {
    executor(promise.resolve.bind(promise), promise.reject.bind(promise));
  }
  return promise;
}

/**
 * Creates an immediately fulfilled promise, with the given
 * argument as its value
 * @public
 * @since 1.2.0
 * @param {any} value The value the promise is to be fulfilled with
 * @returns {Denote} A new Denote promise instance that is
 * fulfilled with the given value
 */
denote.resolve = function(value) {
  var promise = denote();
  promise.resolve(value);
  return promise;
};

/**
 * Creates an immediately rejected promise, with the given
 * argument as its reason
 * @public
 * @since 1.2.0
 * @param {any} reason The reason the promise is to be rejected with
 * @returns {Denote} A new Denote promise instance that is
 * rejected with the given reason
 */
denote.reject = function(reason) {
  var promise = denote();
  promise.reject(reason);
  return promise;
};

module.exports = denote;
