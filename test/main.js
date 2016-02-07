var sinon = require('sinon');
var expect = require('expect.js');

var denote = require('..');
var Denote = require('../denote');

function wait(callback) {
  setTimeout(callback);
}

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

    it('calls the onFulfilled callback', function(done) {
      promise.then(onFulfilled);
      promise.resolve();
      wait(function() {
        expect(onFulfilled.called).to.be(true);
        done();
      });
    });

    it('calls onFulfilled with with the promise value', function(done) {
      promise.then(onFulfilled);
      promise.resolve('my value');
      wait(function() {
        expect(onFulfilled.calledWith('my value')).to.be(true);
        done();
      });
    });

    it('calls multiple onFulfilled callbacks', function(done) {
      var anotherOnFulfilled = sinon.spy();
      promise.then(onFulfilled);
      promise.then(anotherOnFulfilled);
      promise.resolve();
      wait(function() {
        expect(onFulfilled.called).to.be(true);
        expect(anotherOnFulfilled.called).to.be(true);
        done();
      });
    });

    it('calls the onFulfilled callbacks in order', function(done) {
      var result;
      promise.then(function() {
        result = 'first';
      });
      promise.then(function() {
        result = 'second';
      });
      promise.resolve();
      wait(function() {
        expect(result).to.be('second');
        done();
      });
    });

    it('resolves the returned promise on resolve if onFulfilled is not a function', function(done) {
      var promise2 = promise.then('not a function');
      promise2.then(onFulfilled);
      promise.resolve('my value');
      wait(function() {
        expect(onFulfilled.calledWith('my value')).to.be(true);
        done();
      });
    });

    it('rejects the returned promise if onFulfilled throws an error', function(done) {
      var onRejected = sinon.spy();
      var error = new Error();
      var promise2 = promise.then(function() { throw error; });
      promise2.then(undefined, onRejected);
      promise.resolve();
      wait(function() {
        wait(function() {
          expect(onRejected.calledWith(error)).to.be(true);
          done();
        });
      });
    });
  });

  describe('when the promise is rejected', function() {
    var onRejected;

    beforeEach(function() {
      onRejected = sinon.spy();
    });

    it('ignores onRejected arguments that are not functions');

    it('calls the onRejected callback', function(done) {
      promise.then(undefined, onRejected);
      promise.reject();
      wait(function() {
        expect(onRejected.called).to.be(true);
        done();
      });
    });

    it('calls the onRejected callback with a reason', function(done) {
      promise.then(undefined, onRejected);
      promise.reject('my reason');
      wait(function() {
        expect(onRejected.calledWith('my reason')).to.be(true);
        done();
      });
    });

    it('calls multiple onRejected callbacks', function(done) {
      var anotherOnRejected = sinon.spy();
      promise.then(undefined, onRejected);
      promise.then(undefined, anotherOnRejected);
      promise.reject();
      wait(function() {
        expect(onRejected.called).to.be(true);
        expect(anotherOnRejected.called).to.be(true);
        done();
      });
    });

    it('calls the onRejected callbacks in order', function(done) {
      var result;
      promise.then(undefined, function() {
        result = 'first';
      });
      promise.then(undefined, function() {
        result = 'second';
      });
      promise.reject();
      wait(function() {
        expect(result).to.be('second');
        done();
      });
    });

    it('rejects the returned promise on reject if onRejected is not a function', function(done) {
      var promise2 = promise.then(undefined, 'not a function');
      promise2.then(undefined, onRejected);
      promise.reject('reason');
      wait(function() {
        expect(onRejected.calledWith('reason')).to.be(true);
        done();
      });
    });

    it('rejects the returned promise if onRejected throws an error', function(done) {
      var error = new Error();
      var promise2 = promise.then(undefined, function() { throw error; });
      promise2.then(undefined, onRejected);
      promise.reject();
      wait(function() {
        wait(function() {
          expect(onRejected.calledWith(error)).to.be(true);
          done();
        });
      });
    });
  });
});
