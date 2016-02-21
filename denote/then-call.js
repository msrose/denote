/**
 * Author: Michael Rose
 * License: MIT
 */

'use strict';

var _ = require('./utils');

function ThenCall(onFulfilled, onRejected, returnPromise) {
  this.onFulfilled = onFulfilled;
  this.onRejected = onRejected;
  this.returnPromise = returnPromise;
}

ThenCall.prototype.fulfill = function(value) {
  if(_.isFunction(this.onFulfilled)) {
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

ThenCall.prototype.reject = function(reason) {
  if(_.isFunction(this.onRejected)) {
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

module.exports = ThenCall;
