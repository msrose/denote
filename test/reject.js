'use strict';

var sinon = require('sinon');
var expect = require('expect.js');
var wait = require('./wait');

var states = require('../denote/utils').states;
var denote = require('../denote');

describe('when a promise is rejected', function() {
  var onRejected, promise;

  beforeEach(function() {
    onRejected = sinon.spy();
    promise = denote();
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

  it('transitions to the rejected state', function() {
    promise.reject();
    expect(promise._state).to.be(states.REJECTED);
  });

  it('only calls the onRejected handler once', function(done) {
    promise.then(undefined, onRejected);
    promise.reject();
    wait(function() {
      expect(onRejected.calledOnce).to.be(true);
      promise.reject();
      wait(function() {
        expect(onRejected.calledOnce).to.be(true);
        done();
      });
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

  it('calls the onRejected callback if the promise has already been rejected', function(done) {
    promise.reject('best reason');
    promise.then(undefined, onRejected);
    wait(function() {
      expect(onRejected.calledWith('best reason')).to.be(true);
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
      expect(onRejected.calledWith(error)).to.be(true);
      done();
    });
  });

  it('fulfills the returned promise with the value onRejected returns', function(done) {
    var onFulfilled = sinon.spy();
    var promise2 = promise.then(undefined, function() { return 'hehe'; });
    promise2.then(onFulfilled);
    promise.reject();
    wait(function() {
      expect(onFulfilled.calledWith('hehe')).to.be(true);
      done();
    });
  });

  it('calls the onRejected handler without a this value', function(done) {
    promise.then(undefined, onRejected);
    promise.reject('a good reason');
    wait(function() {
      expect(onRejected.calledOn(undefined)).to.be(true);
      done();
    });
  });
});
