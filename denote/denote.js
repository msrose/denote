/**
 * Author: Michael Rose
 * License: https://github.com/msrose/denote/blob/master/LICENSE
 */

'use strict';

var utils = require('./utils');
var ThenCall = require('./then-call');

var PENDING = utils.states.PENDING,
  FULFILLED = utils.states.FULFILLED,
  REJECTED = utils.states.REJECTED;

function Denote() {
  this._thenCalls = [];
  this._state = PENDING;
  this._resolving = false;
  this._value = undefined;
  this._reason = undefined;
}

Denote.prototype.then = function(onFulfilled, onRejected) {
  var thenCall = new ThenCall(onFulfilled, onRejected, new Denote());
  if(this._state === FULFILLED) {
    thenCall.fulfill(this._value);
  } else if(this._state === REJECTED) {
    thenCall.reject(this._reason);
  } else {
    this._thenCalls.push(thenCall);
  }
  return thenCall.returnPromise;
};

function fulfill(promise, fulfillValue) {
  promise._state = FULFILLED;
  promise._resolving = false;
  promise._value = fulfillValue;
  promise._thenCalls.forEach(function(thenCall) {
    thenCall.fulfill(fulfillValue);
  });
}

Denote.prototype.resolve = function(value) {
  if(this._state !== PENDING || this._resolving) {
    return;
  }
  if(value === this) {
    throw new TypeError();
  }
  this._resolving = true;
  if(value instanceof Denote) {
    value.then(fulfill.bind(undefined, this), this.reject.bind(this));
  } else if(utils.isObject(value) || utils.isFunction(value)) {
    var called = false;
    try {
      var then = value.then;
      if(utils.isFunction(then)) {
        var self = this;
        var resolveFunction = function(resolveValue) {
          if(!called) {
            called = true;
            self._resolving = false;
            self.resolve(resolveValue);
          }
        };
        var rejectFunction = function(rejectValue) {
          if(!called) {
            called = true;
            self.reject(rejectValue);
          }
        };
        then.call(value, resolveFunction, rejectFunction);
      } else {
        fulfill(this, value);
      }
    } catch(e) {
      if(!called) {
        this.reject(e);
      }
    }
  } else {
    fulfill(this, value);
  }
};

Denote.prototype.reject = function(reason) {
  if(this._state !== PENDING) {
    return;
  }
  this._state = REJECTED;
  this._reason = reason;
  this._thenCalls.forEach(function(thenCall) {
    thenCall.reject(reason);
  });
};

module.exports = Denote;
