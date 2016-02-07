var assert = require('assert');
var denote = require('..');

describe('The promise object', function() {
  it('defines a then method', function() {
    var promise = denote();
    assert.equal(typeof promise.then, 'function');
  });
});
