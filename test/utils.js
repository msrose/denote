'use strict';

var sinon = require('sinon');
var expect = require('expect.js');

var _ = require('../denote/utils');

describe('Utility functions', function() {
  describe('The once function', function() {
    var myFunc, onceFunc;

    beforeEach(function() {
      myFunc = sinon.spy();
      onceFunc = _.once(myFunc);
    });

    it('makes the callback only be called once', function() {
      onceFunc();
      expect(myFunc.calledOnce).to.be(true);
      onceFunc();
      expect(myFunc.calledOnce).to.be(true);
    });

    it('calls the function once with the correct arguments', function() {
      onceFunc('a good arg');
      expect(myFunc.calledWith('a good arg')).to.be(true);
    });
  });
});
