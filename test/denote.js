'use strict';

var expect = require('expect.js');
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
});
