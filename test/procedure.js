'use strict';

var sinon = require('sinon');
var expect = require('expect.js');
var wait = require('./wait');

var denote = require('../denote');

describe('performing the promise resolution procedure', function() {
  var onFulfilled, onRejected, promise;

  beforeEach(function() {
    onFulfilled = sinon.spy();
    onRejected = sinon.spy();
    promise = denote();
  });

  it('rejects the promise if resolved with itself', function() {
    expect(function() {
      promise.resolve(promise);
    }).to.throwException(function(e) {
      expect(e).to.be.a(TypeError);
    });
  });

  it('remains pending when resolved with a pending promise', function() {
    promise.resolve(denote());
    expect(promise.state).to.be('pending');
  });

  it('fulfills the promise when resolved with another promise that gets fulfilled', function(done) {
    var promise2 = denote();
    promise.then(onFulfilled);
    promise.resolve(promise2);
    promise2.resolve('yoyoyo');
    wait(function() {
      wait(function() {
        expect(onFulfilled.calledWith('yoyoyo')).to.be(true);
        done();
      });
    });
  });

  it('rejects the promise when resolved with another promise that gets rejected', function(done) {
    var promise2 = denote();
    promise.then(undefined, onRejected);
    promise.resolve(promise2);
    promise2.reject('a good reason');
    wait(function() {
      wait(function() {
        expect(onRejected.calledWith('a good reason')).to.be(true);
        done();
      });
    });
  });

  it('fulfills the promise when resolved with another promise that is already fulfilled', function(done) {
    promise.resolve('here it is');
    var promise2 = denote();
    promise2.then(onFulfilled);
    wait(function() {
      expect(promise.state).to.be('fulfilled');
      promise2.resolve(promise);
      wait(function() {
        wait(function() {
          expect(onFulfilled.calledWith('here it is')).to.be(true);
          done();
        });
      });
    });
  });

  it('rejects the promise when resolved with another promise that is already rejected', function(done) {
    promise.reject('here it is');
    var promise2 = denote();
    promise2.then(undefined, onRejected);
    wait(function() {
      expect(promise.state).to.be('rejected');
      promise2.resolve(promise);
      wait(function() {
        wait(function() {
          expect(onRejected.calledWith('here it is')).to.be(true);
          done();
        });
      });
    });
  });

  describe('when resolved with a thenable', function() {
    var thenable;

    beforeEach(function() {
      thenable = { then: sinon.spy() };
    });

    it('calls then if it is a function with two function arguments', function(done) {
      promise.resolve(thenable);
      wait(function() {
        expect(thenable.then.calledWith(sinon.match.func, sinon.match.func)).to.be(true);
        done();
      });
    });

    it('rejects the promise if calling then throws an error', function(done) {
      var error = new Error();
      thenable.then = function() { throw error; };
      promise.then(undefined, onRejected);
      promise.resolve(thenable);
      wait(function() {
        expect(onRejected.calledWith(error)).to.be(true);
        done();
      });
    });

    it('resolves the promise when resolvePromise callback called with first argument', function(done) {
      thenable.then = function(resolvePromise) {
        resolvePromise('llamas');
      };
      promise.then(onFulfilled);
      promise.resolve(thenable);
      wait(function() {
        expect(onFulfilled.calledWith('llamas')).to.be(true);
        done();
      });
    });

    it('rejects the promise when rejectPromise callback called with first argument', function(done) {
      thenable.then = function(resolvePromise, rejectPromise) {
        rejectPromise('dragons');
      };
      promise.then(undefined, onRejected);
      promise.resolve(thenable);
      wait(function() {
        expect(onRejected.calledWith('dragons')).to.be(true);
        done();
      });
    });

    it('ignores multiple calls to the resolvePromise callback', function(done) {
      thenable.then = function(resolvePromise) {
        resolvePromise('here we are');
        resolvePromise('here we are again');
      };
      promise.then(onFulfilled);
      promise.resolve(thenable);
      wait(function() {
        expect(onFulfilled.calledOnce).to.be(true);
        done();
      });
    });

    it('fulfills promise with the thenable if then property is not a function', function(done) {
      thenable.then = 'not a function';
      promise.then(onFulfilled);
      promise.resolve(thenable);
      wait(function() {
        expect(onFulfilled.calledWith(thenable)).to.be(true);
        done();
      });
    });
  });
});
