'use strict';

var sinon = require('sinon');
var expect = require('expect.js');
var wait = require('./wait');

var denote = require('../denote');
var Denote = require('../denote/denote');

describe('The catch method', function() {
  var promise;

  beforeEach(function() {
    promise = denote();
  });

  it('returns a promise', function() {
    expect(promise.catch()).to.be.a(Denote);
  });

  it('registers a rejection handler that gets called on rejection', function(done) {
    var onRejected = sinon.spy();
    promise.catch(onRejected);
    promise.reject('here is a reason');
    wait(function() {
      expect(onRejected.called).to.be(true);
      done();
    });
  });
});
