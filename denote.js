'use strict';

function Denote() {
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];
}

function isFunction(value) {
  return typeof value === 'function';
}

Denote.prototype.then = function(onFulfilled, onRejected) {
  if(isFunction(onFulfilled)) {
    this.onFulfilledCallbacks.push(onFulfilled);
  }
  if(isFunction(onRejected)) {
    this.onRejectedCallbacks.push(onRejected);
  }
  return new Denote();
};

Denote.prototype.resolve = function(value) {
  this.onFulfilledCallbacks.forEach(function(callback) {
    callback(value);
  });
};

Denote.prototype.reject = function(reason) {
  this.onRejectedCallbacks.forEach(function(callback) {
    callback(reason);
  });
};

module.exports = Denote;
