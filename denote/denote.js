'use strict';

var ThenCall = require('./then-call');
var _ = require('./utils');

var PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected';

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
  var self = this;
  if (self.state !== PENDING || self.resolving) {
    return;
  }
  if (value === self) {
    throw new TypeError();
  }
  self.resolving = true;
  if (value instanceof Denote) {
    value.then(fulfill, self.reject.bind(self));
  } else if (_.isObject(value) || _.isFunction(value)) {
    try {
      var then = value.then;
      if (_.isFunction(then)) {
        var resolveFunction = function(resolveValue) {
          self.resolving = false;
          self.resolve(resolveValue);
        };
        var rejectFunction = self.reject.bind(self);
        then.call(value, resolveFunction, rejectFunction);
      } else {
        fulfill(value);
      }
    } catch (e) {
      self.reject(e);
    }
  } else {
    fulfill(value);
  }
  function fulfill(fulfillValue) {
    if (self.state !== PENDING) {
      return;
    }
    self.state = FULFILLED;
    self.resolving = false;
    self.value = fulfillValue;
    self.thenCalls.forEach(function(thenCall) {
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
