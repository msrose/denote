'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var wait = require('./wait');

var states = require('../denote/denote').states;
var denote = require('../denote');
var Denote = require('../denote/denote');

describe('Denote', function() {
  var promise;

  beforeEach(function() {
    promise = denote();
  });

  it('defines a then method', function() {
    expect(promise.then).to.be.a('function');
  });

  it('starts out in pending state', function() {
    expect(promise._state).to.be(states.PENDING);
  });

  describe('the then method', function() {
    it('returns a promise', function() {
      expect(promise.then()).to.be.a(Denote);
    });
  });

  it('can be used to create an immediately fulfilled promise', function(done) {
    promise = denote.resolve('llama boy');
    wait(function() {
      expect(promise._state).to.be(states.FULFILLED);
      promise.then(function(value) {
        expect(value).to.be('llama boy');
        done();
      });
    });
  });

  it('can be used to create an immediately rejected promise', function(done) {
    promise = denote.reject('a best reason');
    wait(function() {
      expect(promise._state).to.be(states.REJECTED);
      promise.catch(function(reason) {
        expect(reason).to.be('a best reason');
        done();
      });
    });
  });

  it('immediately calls a function argument to the factory', function() {
    var spy = sinon.spy();
    promise = denote(spy);
    expect(spy.calledOnce).to.be(true);
  });

  it('provides a function that fulfills the promise as the first argument to the executor', function(done) {
    promise = denote(function(resolve) {
      expect(resolve).to.be.a(Function);
      resolve('hehe');
    });
    wait(function() {
      expect(promise._state).to.be(states.FULFILLED);
      promise.then(function(value) {
        expect(value).to.be('hehe');
        done();
      });
    });
  });

  it('provides a function that rejects the promise as the second argument to the executor', function(done) {
    promise = denote(function(resolve, reject) {
      expect(reject).to.be.a(Function);
      reject('eheh');
    });
    wait(function() {
      expect(promise._state).to.be(states.REJECTED);
      promise.catch(function(reason) {
        expect(reason).to.be('eheh');
        done();
      });
    });
  });
});
