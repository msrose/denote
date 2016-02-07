'use strict';

function Denote() {
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];
}

Denote.prototype.then = function(onFulfilled, onRejected) {
  this.onFulfilledCallbacks.push(onFulfilled);
  this.onRejectedCallbacks.push(onRejected);
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
