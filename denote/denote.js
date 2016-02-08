'use strict';

var ThenCall = require('./then-call');

var PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected';

function isFunction(value) {
  return typeof value === 'function';
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function Denote() {
  this.thenCalls = [];
  this.state = PENDING;
  this.resolving = false;
  this.value = undefined;
  this.reason = undefined;
}

Denote.prototype.then = function(onFulfilled, onRejected) {
  var thenCall = new ThenCall(onFulfilled, onRejected, new Denote());
  if (this.state === FULFILLED) {
    thenCall.fulfill(this.value);
  } else if (this.state === REJECTED) {
    thenCall.reject(this.reason);
  } else {
    this.thenCalls.push(thenCall);
  }
  return thenCall.returnPromise;
};

Denote.prototype.resolve = function(value) {
  if (this.state !== PENDING || this.resolving) {
    return;
  }
  if (value === this) {
    throw new TypeError();
  }
  this.resolving = true;
  if (value instanceof Denote) {
    value.then(fulfill.bind(this), this.reject.bind(this));
  } else if (isObject(value) || isFunction(value)) {
    try {
      var then = value.then;
      if (isFunction(then)) {
        var self = this;
        then.call(value, function(resolveValue) {
          self.resolving = false;
          self.resolve(resolveValue);
        }, this.reject.bind(this));
      } else {
        fulfill.call(this, value);
      }
    } catch (e) {
      this.reject(e);
    }
  } else {
    fulfill.call(this, value);
  }
  function fulfill(fulfillValue) {
    if (this.state !== PENDING) {
      return;
    }
    this.state = FULFILLED;
    this.resolving = false;
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
