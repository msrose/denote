'use strict';

var expect = require('expect.js');

var states = require('../denote/utils').states;
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
    expect(promise.state).to.be(states.PENDING);
  });

  describe('the then method', function() {
    it('returns a promise', function() {
      expect(promise.then()).to.be.a(Denote);
    });
  });
});
