'use strict';

var sinon = require('sinon');
var expect = require('expect.js');
var wait = require('./wait');

var denote = require('../denote');

describe('Resolving a promise', function() {
  var onFulfilled, promise;

  beforeEach(function() {
    promise = denote();
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

  it('transitions to the fulfilled state', function() {
    promise.resolve();
    expect(promise.state).to.be('fulfilled');
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

  it('calls the onFulfilled callback if the promise has already been fulfilled', function(done) {
    promise.resolve('best value');
    promise.then(onFulfilled);
    wait(function() {
      expect(onFulfilled.calledWith('best value')).to.be(true);
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

  it('fulfills the returned promise the value onFulfilled returns', function(done) {
    var promise2 = promise.then(function() { return 'llamas'; });
    promise2.then(onFulfilled);
    promise.resolve();
    wait(function() {
      wait(function() {
        expect(onFulfilled.calledWith('llamas')).to.be(true);
        done();
      });
    });
  });

  it('calls the onFulfilled handler only once', function(done) {
    promise.then(onFulfilled);
    promise.resolve();
    wait(function() {
      expect(onFulfilled.calledOnce).to.be(true);
      promise.resolve();
      wait(function() {
        expect(onFulfilled.calledOnce).to.be(true);
        done();
      });
    });
  });

  it('calls the onFulfilled handler only once when resolved with another promise', function(done) {
    var promise2 = denote();
    promise.then(onFulfilled);
    promise.resolve(promise2);
    promise.resolve(promise2);
    promise2.resolve('hehe');
    wait(function() {
      wait(function() {
        expect(onFulfilled.calledOnce).to.be(true);
        wait(function() {
          expect(onFulfilled.calledOnce).to.be(true);
          done();
        });
      });
    });
  });

  it('calls the onFulfilled handler without a this value', function(done) {
    promise.then(onFulfilled);
    promise.resolve();
    wait(function() {
      expect(onFulfilled.calledOn(undefined)).to.be(true);
      done();
    });
  });

  it('works correctly with a null resolve value', function(done) {
    promise.then(onFulfilled);
    promise.resolve(null);
    wait(function() {
      expect(onFulfilled.calledWith(null)).to.be(true);
      done();
    });
  });
});
