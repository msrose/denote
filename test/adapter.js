'use strict';

var denote = require('../denote');

exports.deferred = function() {
  var promise = denote();
  return {
    promise: promise,
    resolve: function(value) {
      promise.resolve(value);
    },
    reject: function(reason) {
      promise.reject(reason);
    }
  };
};
