var assert = require('assert');
var denote = require('..');

describe('The promise object', function() {
  var promise;

  beforeEach(function() {
    promise = denote();
  });

  it('defines a then method', function() {
    assert.equal(typeof promise.then, 'function');
  });

  describe('when the promise is resolved', function() {
    it('calls the onFulfilled callback', function(done) {
      promise.then(function(value) {
        assert.equal(value, 'my value');
        done();
      });
      promise.resolve('my value');
    });
  });

  describe('when the promise is rejected', function() {
    it('calls the onRejected callback', function(done) {
      promise.then(function() {
      }, function(reason) {
        assert.equal(reason, 'my reason');
        done();
      });
      promise.reject('my reason');
    });
  });
});
