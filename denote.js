'use strict';

function Denote() {
  this.thenCalls = [];
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
  this.thenCalls.push(thenCall)
  return thenCall.returnPromise;
};

Denote.prototype.resolve = function(value) {
  this.thenCalls.forEach(function(thenCall) {
    if(isFunction(thenCall.onFulfilled)) {
      try {
        thenCall.onFulfilled(value);
      } catch(e) {
        thenCall.returnPromise.reject(e);
      }
    } else {
      thenCall.returnPromise.resolve(value);
    }
  });
};

Denote.prototype.reject = function(reason) {
  this.thenCalls.forEach(function(thenCall) {
    if(isFunction(thenCall.onRejected)) {
      try {
        thenCall.onRejected(reason);
      } catch(e) {
        thenCall.returnPromise.reject(e);
      }
    } else {
      thenCall.returnPromise.reject(reason);
    }
  });
};

module.exports = Denote;
