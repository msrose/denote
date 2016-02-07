var sinon = require('sinon');
var expect = require('expect.js');

var denote = require('..');

describe('The promise object', function() {
  var promise;

  beforeEach(function() {
    promise = denote();
  });

  it('defines a then method', function() {
    expect(promise.then).to.be.a('function');
  });

  describe('when the promise is resolved', function() {
    it('calls the onFulfilled callback', function() {
      var onFulfilled = sinon.spy();
      promise.then(onFulfilled);
      promise.resolve();
      expect(onFulfilled.called).to.be(true);
    });

    it('calls onFulfilled with with the promise value', function() {
      var onFulfilled = sinon.spy();
      promise.then(onFulfilled);
      promise.resolve('my value');
      expect(onFulfilled.calledWith('my value')).to.be(true);
    });
  });

  describe('when the promise is rejected', function() {
    it('calls the onRejected callback', function() {
      var onRejected = sinon.spy();
      promise.then(undefined, onRejected);
      promise.reject();
      expect(onRejected.called).to.be(true);
    });

    it('calls the onRejected callback with a reason', function() {
      var onRejected = sinon.spy();
      promise.then(undefined, onRejected);
      promise.reject('my reason');
      expect(onRejected.calledWith('my reason')).to.be(true);
    });
  });
});
