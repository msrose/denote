/**
 * @author Michael Rose
 * @license https://github.com/msrose/denote/blob/master/LICENSE
 */

/**
 * Exposes the essential promise API. It can be used as a factory function
 * to create promises, which can also be passed an executor which gets called with resolve and
 * reject functions as arguments. Use the static methods to create immediately fulfilled or
 * rejected promises, or work with groups of promises.
 * See the {@link Denote} class for documentation of the promise instance methods.
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

var denote =
/**
 * A factory function that can be used to create new Denote promise instances.
 * If passed an executor function, it will be called immediately with arguments
 * to resolve or reject the returned promise.
 * @public
 * @since 1.2.0
 * @param {module:denote~executor} [executor] A function that will be called immediately
 * with the returned promises resolve and reject instance methods as arguments
 * @returns {Denote} A new Denote promise instance
 */
module.exports = function(executor) {
  var promise = new Denote();
  if(utils.isFunction(executor)) {
    executor(promise.resolve.bind(promise), promise.reject.bind(promise));
  }
  return promise;
};

/**
 * Creates an immediately fulfilled promise, with the given
 * argument as its value
 * @public
 * @since 1.2.0
 * @param {any} value The value the promise is to be fulfilled with
 * @returns {Denote} A new Denote promise instance that is
 * fulfilled with the given value
 */
module.exports.resolve = function(value) {
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
module.exports.reject = function(reason) {
  var promise = denote();
  promise.reject(reason);
  return promise;
};

/**
 * Returns a promise that is fulfilled when all promises in the
 * given array are fulfilled. If any of the given promises are
 * rejected, the returned promise is immediately rejected with the
 * same reason.
 * @public
 * @since 1.2.0
 * @param {array} list A list of values, which may include promises.
 * Any promises in the list will be resolved.
 * @returns {Denote} A new Denote promise instance
 */
module.exports.all = function(list) {
  var returnPromise = denote();
  if(Array.isArray(list) && list.length > 0) {
    var values = new Array(list.length);
    var processed = 0;
    var rejected = false;
    list.forEach(function(item, i) {
      denote.resolve(item).then(function(value) {
        if(!rejected) {
          values[i] = value;
          processed++;
          if(processed === list.length) {
            returnPromise.resolve(values);
          }
        }
      }, function(reason) {
        rejected = true;
        returnPromise.reject(reason);
      });
    });
  } else {
    returnPromise.resolve([]);
  }
  return returnPromise;
};

/**
 * Returns a promise that gets fulfilled or rejected with the
 * value/reason of the first promise to be fulfilled or rejected
 * from the list of given promises.
 * @public
 * @since 1.2.0
 * @param {array} list A list of values, which may include promises.
 * Any promises in the list will be resolved.
 * @returns {Denote} A new Denote promise instance
 */
module.exports.race = function(list) {
  var promise = denote();
  if(Array.isArray(list) && list.length > 0) {
    var done = false;
    list.forEach(function(item) {
      denote.resolve(item).then(function(value) {
        if(!done) {
          done = true;
          promise.resolve(value);
        }
      }, function(reason) {
        if(!done) {
          done = true;
          promise.reject(reason);
        }
      });
    });
  } else {
    promise.resolve();
  }
  return promise;
};
