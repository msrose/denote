var sinon = require('sinon');
var expect = require('expect.js');

var denote = require('..');
var Denote = require('../denote');

describe('The promise object', function() {
  var promise;

  beforeEach(function() {
    promise = denote();
  });

  it('defines a then method', function() {
    expect(promise.then).to.be.a('function');
  });

  describe('the then method', function() {
    it('returns a promise', function() {
      expect(promise.then()).to.be.a(Denote);
    });
  });

  describe('when the promise is resolved', function() {
    var onFulfilled;

    beforeEach(function() {
      onFulfilled = sinon.spy();
    });

    it('ignores onFulfilled arguments that are not functions');

    it('calls the onFulfilled callback', function() {
      promise.then(onFulfilled);
      promise.resolve();
      expect(onFulfilled.called).to.be(true);
    });

    it('calls onFulfilled with with the promise value', function() {
      promise.then(onFulfilled);
      promise.resolve('my value');
      expect(onFulfilled.calledWith('my value')).to.be(true);
    });

    it('calls multiple onFulfilled callbacks', function() {
      var anotherOnFulfilled = sinon.spy();
      promise.then(onFulfilled);
      promise.then(anotherOnFulfilled);
      promise.resolve();
      expect(onFulfilled.called).to.be(true);
      expect(anotherOnFulfilled.called).to.be(true);
    });

    it('calls the onFulfilled callbacks in order', function() {
      var result;
      promise.then(function() {
        result = 'first';
      });
      promise.then(function() {
        result = 'second';
      });
      promise.resolve();
      expect(result).to.be('second');
    });

    it('resolves the returned promise on resolve if onFulfilled is not a function', function() {
      var promise2 = promise.then('not a function');
      promise2.then(onFulfilled);
      promise.resolve('my value');
      expect(onFulfilled.calledWith('my value')).to.be(true);
    });

    it('rejects the returned promise if onFulfilled throws an error', function() {
      var onRejected = sinon.spy();
      var error = new Error();
      var promise2 = promise.then(function() { throw error; });
      promise2.then(undefined, onRejected);
      promise.resolve();
      expect(onRejected.calledWith(error)).to.be(true);
    });
  });

  describe('when the promise is rejected', function() {
    var onRejected;

    beforeEach(function() {
      onRejected = sinon.spy();
    });

    it('ignores onRejected arguments that are not functions');

    it('calls the onRejected callback', function() {
      promise.then(undefined, onRejected);
      promise.reject();
      expect(onRejected.called).to.be(true);
    });

    it('calls the onRejected callback with a reason', function() {
      promise.then(undefined, onRejected);
      promise.reject('my reason');
      expect(onRejected.calledWith('my reason')).to.be(true);
    });

    it('calls multiple onRejected callbacks', function() {
      var anotherOnRejected = sinon.spy();
      promise.then(undefined, onRejected);
      promise.then(undefined, anotherOnRejected);
      promise.reject();
      expect(onRejected.called).to.be(true);
      expect(anotherOnRejected.called).to.be(true);
    });

    it('calls the onRejected callbacks in order', function() {
      var result;
      promise.then(undefined, function() {
        result = 'first';
      });
      promise.then(undefined, function() {
        result = 'second';
      });
      promise.reject();
      expect(result).to.be('second');
    });

    it('rejects the returned promise on reject if onRejected is not a function', function() {
      var promise2 = promise.then(undefined, 'not a function');
      promise2.then(undefined, onRejected);
      promise.reject('reason');
      expect(onRejected.calledWith('reason')).to.be(true);
    });

    it('rejects the returned promise if onRejected throws an error', function() {
      var error = new Error();
      var promise2 = promise.then(undefined, function() { throw error; });
      promise2.then(undefined, onRejected);
      promise.reject();
      expect(onRejected.calledWith(error)).to.be(true);
    });
  });
});
