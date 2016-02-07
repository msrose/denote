'use strict';

function Denote() {

}

Denote.prototype.then = function(onFulfilled, onRejected) {
  this.onFulfilled = onFulfilled;
  this.onRejected = onRejected;
};

Denote.prototype.resolve = function(value) {
  this.onFulfilled(value);
};

Denote.prototype.reject = function(reason) {
  this.onRejected(reason);
};

module.exports = Denote;
