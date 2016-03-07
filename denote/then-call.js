/**
 * @author Michael Rose
 * @license https://github.com/msrose/denote/blob/master/LICENSE
 * @module ThenCall
 */

'use strict';

var utils = require('./utils');

/**
 * Represents a call to Denote#then
 * @constructor
 * @public
 * @param {function} onFulfilled The fulfillment handler for the call to Denote#then
 * @param {function} onRejected The rejection handler for the call to Denote#then
 * @param {Denote} returnPromise The Denote promise instance returned by Denote#then
 */
function ThenCall(onFulfilled, onRejected, returnPromise) {
  this.onFulfilled = onFulfilled;
  this.onRejected = onRejected;
  this.returnPromise = returnPromise;
}

/**
 * Calls the fulfillment handler (if it is a function) with the given value
 * as the first argument, and resolves or rejects the return promise appropriately
 * @param {any} value The value to pass as the first arugment of the fulfillment handler
 * @returns {undefined}
 */
ThenCall.prototype.fulfill = function(value) {
  if(utils.isFunction(this.onFulfilled)) {
    var thenCall = this;
    process.nextTick(function() {
      try {
        var returnValue = thenCall.onFulfilled.call(undefined, value);
        thenCall.returnPromise.resolve(returnValue);
      } catch(e) {
        thenCall.returnPromise.reject(e);
      }
    });
  } else {
    this.returnPromise.resolve(value);
  }
};

/**
 * Calls the rejection handler (if it is a function) with the given reason
 * as the first argument, and resolves or rejects the return promise appropriately
 * @param {any} value The reason to pass as the first argument of the rejection handler
 * @returns {undefined}
 */
ThenCall.prototype.reject = function(reason) {
  if(utils.isFunction(this.onRejected)) {
    var thenCall = this;
    process.nextTick(function() {
      try {
        var returnValue = thenCall.onRejected.call(undefined, reason);
        thenCall.returnPromise.resolve(returnValue);
      } catch(e) {
        thenCall.returnPromise.reject(e);
      }
    });
  } else {
    this.returnPromise.reject(reason);
  }
};

/**
 * The ThenCall constructor
 */
module.exports = ThenCall;
