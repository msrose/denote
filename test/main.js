var assert = require('assert');
var sinon = require('sinon');

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
    it('calls the onFulfilled callback', function() {
      var onFulfilled = sinon.spy();
      promise.then(onFulfilled);
      promise.resolve();
      assert(onFulfilled.called);
    });
  });

  describe('when the promise is rejected', function() {
    it('calls the onRejected callback', function() {
      var onRejected = sinon.spy();
      promise.then(undefined, onRejected);
      promise.reject();
      assert(onRejected.called);
    });
  });
});
