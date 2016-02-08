'use strict';

var ThenCall = require('./then-call');

var PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected';

function Denote() {
  this.thenCalls = [];
  this.state = PENDING;
  this.value = undefined;
  this.reason = undefined;
}

Denote.prototype.then = function(onFulfilled, onRejected) {
  var thenCall = new ThenCall(onFulfilled, onRejected, new Denote());
  if(this.state === FULFILLED) {
    thenCall.fulfill(this.value);
  } else if(this.state === REJECTED) {
    thenCall.reject(this.reason);
  } else {
    this.thenCalls.push(thenCall);
  }
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
    this.value = fulfillValue;
    this.thenCalls.forEach(function(thenCall) {
      thenCall.fulfill(fulfillValue);
    });
  }
};

Denote.prototype.reject = function(reason) {
  if (this.state !== PENDING) {
    return;
  }
  this.state = REJECTED;
  this.reason = reason;
  this.thenCalls.forEach(function(thenCall) {
    thenCall.reject(reason);
  });
};

module.exports = Denote;
