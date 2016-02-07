'use strict';

var PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected';

function Denote() {
  this.thenCalls = [];
  this.state = PENDING;
}

function isFunction(value) {
  return typeof value === 'function';
}

Denote.prototype.then = function(onFulfilled, onRejected) {
  var thenCall = {
    onFulfilled: onFulfilled,
    onRejected: onRejected,
    returnPromise: new Denote()
  };
  this.thenCalls.push(thenCall);
  return thenCall.returnPromise;
};

Denote.prototype.resolve = function(value) {
  if (this.state !== PENDING) {
    return;
  }
  if (value === this) {
    throw new TypeError();
  }
  if (value instanceof Denote) {
    value.then(fulfill.bind(this), this.reject.bind(this));
  } else {
    fulfill.call(this, value);
  }
  function fulfill(fulfillValue) {
    this.state = FULFILLED;
    this.thenCalls.forEach(function(thenCall) {
      if (isFunction(thenCall.onFulfilled)) {
        setTimeout(function() {
          try {
            var returnValue = thenCall.onFulfilled(fulfillValue);
            thenCall.returnPromise.resolve(returnValue);
          } catch (e) {
            thenCall.returnPromise.reject(e);
          }
        });
      } else {
        thenCall.returnPromise.resolve(fulfillValue);
      }
    });
  }
};

Denote.prototype.reject = function(reason) {
  if (this.state !== PENDING) {
    return;
  }
  this.state = REJECTED;
  this.thenCalls.forEach(function(thenCall) {
    if (isFunction(thenCall.onRejected)) {
      setTimeout(function() {
        try {
          var returnValue = thenCall.onRejected(reason);
          thenCall.returnPromise.resolve(returnValue);
        } catch (e) {
          thenCall.returnPromise.reject(e);
        }
      });
    } else {
      thenCall.returnPromise.reject(reason);
    }
  });
};

module.exports = Denote;
