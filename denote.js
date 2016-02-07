'use strict';

function Denote() {

}

Denote.prototype.then = function(onFulfilled, onRejected) {
  this.onFulfilled = onFulfilled;
  this.onRejected = onRejected;
};

Denote.prototype.resolve = function() {
  this.onFulfilled();
};

Denote.prototype.reject = function() {
  this.onRejected();
};

module.exports = Denote;
