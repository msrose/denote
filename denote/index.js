/**
 * @author Michael Rose
 * @license https://github.com/msrose/denote/blob/master/LICENSE
 * @module denote
 */

'use strict';

var Denote = require('./denote');

/**
 * A factory function creating a new Denote promise instance.
 * @public
 * @since 1.0.0
 * @returns {Denote} A new Denote promise instance
 */
function denote() {
  return new Denote();
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
