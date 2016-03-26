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
      }).then(done, done);
    });
  });

  it('can be used to create an immediately rejected promise', function(done) {
    promise = denote.reject('a best reason');
    wait(function() {
      expect(promise._state).to.be(states.REJECTED);
      promise.catch(function(reason) {
        expect(reason).to.be('a best reason');
      }).then(done, done);
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
      }).then(done, done);
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
      }).then(done, done);
    });
  });

  describe('the .all method', function() {
    it('returns a promise', function() {
      promise = denote.all();
      expect(promise).to.be.a(Denote);
    });

    it('resolves the promises passed in an array', function(done) {
      promise = denote.all([denote.resolve('hi'), denote.resolve('bobo')]);
      promise.then(function(value) {
        expect(value).to.be.an(Array);
        expect(value[0]).to.be('hi');
        expect(value[1]).to.be('bobo');
      }).then(done, done);
    });

    it('rejects the promise returned if any of the given promises rejects', function(done) {
      promise = denote.all([denote.resolve('hehe'), denote.reject('hi bruh')]);
      promise.catch(function(reason) {
        expect(reason).to.be('hi bruh');
      }).then(done, done);
    });

    it('passes any non promise values along', function(done) {
      denote.all(['this', 'is', 'a', 'value']).then(function(value) {
        expect(value).to.eql(['this', 'is', 'a', 'value']);
      }).then(done, done);
    });

    it('keeps the values in the correct order', function(done) {
      denote.all(['this', 'should', denote.resolve('keep'), 'order']).then(function(value) {
        expect(value).to.eql(['this', 'should', 'keep', 'order']);
      }).then(done, done);
    });
  });
});
