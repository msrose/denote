'use strict';

function ThenCall(onFulfilled, onRejected, returnPromise) {
  this.onFulfilled = onFulfilled;
  this.onRejected = onRejected;
  this.returnPromise = returnPromise;
}

function isFunction(value) {
  return typeof value === 'function';
}

ThenCall.prototype.fulfill = function(value) {
  if (isFunction(this.onFulfilled)) {
    var thenCall = this;
    setTimeout(function() {
      try {
        var returnValue = thenCall.onFulfilled(value);
        thenCall.returnPromise.resolve(returnValue);
      } catch (e) {
        thenCall.returnPromise.reject(e);
      }
    });
  } else {
    this.returnPromise.resolve(value);
  }
};

ThenCall.prototype.reject = function(reason) {
  if (isFunction(this.onRejected)) {
    var thenCall = this;
    setTimeout(function() {
      try {
        var returnValue = thenCall.onRejected(reason);
        thenCall.returnPromise.resolve(returnValue);
      } catch (e) {
        thenCall.returnPromise.reject(e);
      }
    });
  } else {
    this.returnPromise.reject(reason);
  }
};

module.exports = ThenCall;
