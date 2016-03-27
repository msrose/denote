/**
 * @author Michael Rose
 * @license https://github.com/msrose/denote/blob/master/LICENSE
 */

'use strict';

var utils = require('./utils');

/**
 * Represents a call to Denote#then
 * @constructor
 * @private
 * @param {function} onFulfilled The fulfillment handler for the call to Denote#then
 * @param {function} onRejected The rejection handler for the call to Denote#then
 * @param {Denote} returnPromise The Denote promise instance returned by Denote#then
 */
function ThenCall(onFulfilled, onRejected, returnPromise) {
  this.onFulfilled = onFulfilled;
  this.onRejected = onRejected;
  this.returnPromise = returnPromise;
}

function handle(returnPromise, handler, arg, noHandlerAction) {
  if(utils.isFunction(handler)) {
    process.nextTick(function() {
      try {
        var returnValue = handler(arg);
        returnPromise.resolve(returnValue);
      } catch(e) {
        returnPromise.reject(e);
      }
    });
  } else {
    noHandlerAction(arg);
  }
}

/**
 * Calls the fulfillment handler (if it is a function) with the given value
 * as the first argument, and resolves or rejects the return promise appropriately
 * @param {any} value The value to pass as the first arugment of the fulfillment handler
 * @returns {undefined}
 */
ThenCall.prototype.fulfill = function(value) {
  var noHandlerAction = this.returnPromise.resolve.bind(this.returnPromise);
  handle(this.returnPromise, this.onFulfilled, value, noHandlerAction);
};

/**
 * Calls the rejection handler (if it is a function) with the given reason
 * as the first argument, and resolves or rejects the return promise appropriately
 * @param {any} value The reason to pass as the first argument of the rejection handler
 * @returns {undefined}
 */
ThenCall.prototype.reject = function(reason) {
  var noHandlerAction = this.returnPromise.reject.bind(this.returnPromise);
  handle(this.returnPromise, this.onRejected, reason, noHandlerAction);
};

module.exports = ThenCall;
