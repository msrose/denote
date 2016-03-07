/**
 * @author Michael Rose
 * @license https://github.com/msrose/denote/blob/master/LICENSE
 */

'use strict';

var utils = require('./utils');
var ThenCall = require('./then-call');
var coerce = require('./coerce');

var PENDING = utils.states.PENDING,
  FULFILLED = utils.states.FULFILLED,
  REJECTED = utils.states.REJECTED;

/**
 * Creates a new promise object.
 * @constructor
 * @since 1.0.0
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
 * @since 1.0.0
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
 * @since 1.0.0
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
  var promise = this;
  var fulfill = function(fulfillValue) {
    promise._state = FULFILLED;
    promise._resolving = false;
    promise._value = fulfillValue;
    promise._thenCalls.forEach(function(thenCall) {
      thenCall.fulfill(fulfillValue);
    });
  };
  var reject = this.reject.bind(this);
  coerce(value, Denote, fulfill, reject);
};

/**
 * Rejects the promise with the given reason.
 * Subsequent calls will be ignored.
 * @public
 * @since 1.0.0
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
 * Registers a rejection handler with the promise.
 * Equivalent to calling promise.then(undefined, onRejected).
 * @public
 * @since 1.1.0
 * @param {function} onRejected The rejection handler
 * @returns {Denote} A new instance of a Denote promise
 */
Denote.prototype.catch = function(onRejected) {
  return this.then(undefined, onRejected);
};

module.exports = Denote;
