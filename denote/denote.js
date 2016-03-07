/**
 * @author Michael Rose
 * @license https://github.com/msrose/denote/blob/master/LICENSE
 */

'use strict';

var utils = require('./utils');
var ThenCall = require('./then-call');

var PENDING = utils.states.PENDING,
  FULFILLED = utils.states.FULFILLED,
  REJECTED = utils.states.REJECTED;

/**
 * Creates a new promise object.
 * @constructor
 */
function Denote() {
  this._thenCalls = [];     // list of ThenCall objects (one for each call to .then)
  this._state = PENDING;    // current state of the promise
  this._resolving = false;  // keep track of whether or not .resolve has been called
  this._value = undefined;  // value of the resolved promise
  this._reason = undefined; // reason why the promise was rejected
}

/**
 * Register fulfillment and rejection handlers for a promise.
 * Non-function arguments are ignored.
 * @public
 * @param {function} onFulfilled The fulfillment handler
 * @param {function} onRejected The rejection handler
 * @returns {Denote} A new Denote promise instance
 */
Denote.prototype.then = function(onFulfilled, onRejected) {
  var thenCall = new ThenCall(onFulfilled, onRejected, new Denote());
  if(this._state === FULFILLED) {
    thenCall.fulfill(this._value);
  } else if(this._state === REJECTED) {
    thenCall.reject(this._reason);
  } else {
    this._thenCalls.push(thenCall);
  }
  return thenCall.returnPromise;
};

/**
 * Resolves the promise with the given value
 * Adopts the state of the value if it is a thenable
 * Subsequent calls will be ignored
 * @public
 * @param {any} value the value of the promise
 * @throws {TypeError} If the promise is resolved with itself
 * @returns {undefined}
 */
Denote.prototype.resolve = function(value) {
  if(this._state !== PENDING || this._resolving) {
    return;
  }
  if(value === this) {
    throw new TypeError();
  }
  this._resolving = true;
  coerce(this, value);
};

/**
 * Rejects the promise with the given reason.
 * Subsequent calls will be ignored.
 * @public
 * @param {any} reason The reason why the promise was rejected
 * @returns {undefined}
 */
Denote.prototype.reject = function(reason) {
  if(this._state !== PENDING) {
    return;
  }
  this._state = REJECTED;
  this._reason = reason;
  this._thenCalls.forEach(function(thenCall) {
    thenCall.reject(reason);
  });
};

/**
 * Implements the promise resolution procedure for Denote promises.
 * The promise adopts the state of its resolve value.
 * @private
 * @param {Denote} promise An instance of a Denote object to coerce
 * @param {any} value The value that the promise is resolved with
 * @returns {undefined}
 */
function coerce(promise, value) {
  if(value instanceof Denote) {
    value.then(fulfill.bind(undefined, promise), promise.reject.bind(promise));
  } else if(utils.isObject(value) || utils.isFunction(value)) {
    var called = false;
    try {
      var then = value.then;
      if(utils.isFunction(then)) {
        var resolveFunction = function(resolveValue) {
          if(!called) {
            called = true;
            coerce(promise, resolveValue);
          }
        };
        var rejectFunction = function(rejectValue) {
          if(!called) {
            called = true;
            promise.reject(rejectValue);
          }
        };
        then.call(value, resolveFunction, rejectFunction);
      } else {
        fulfill(promise, value);
      }
    } catch(e) {
      if(!called) {
        promise.reject(e);
      }
    }
  } else {
    fulfill(promise, value);
  }
}

/**
 * Fulfills a Denote promise with its final (non-thenable) value
 * @private
 * @param {Denote} promise The Denote promise instance to fulfill
 * @param {any} value The final value of the resolved promise
 * @returns {undefined}
 */
function fulfill(promise, value) {
  promise._state = FULFILLED;
  promise._resolving = false;
  promise._value = value;
  promise._thenCalls.forEach(function(thenCall) {
    thenCall.fulfill(value);
  });
}

module.exports = Denote;
