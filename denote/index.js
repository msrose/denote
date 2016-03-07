/**
 * @author Michael Rose
 * @license https://github.com/msrose/denote/blob/master/LICENSE
 * @module denote
 */

'use strict';

var Denote = require('./denote');

/**
 * A factory function creating a new Denote promise instance.
 * @public
 * @returns {Denote} A new Denote promise instance
 */
module.exports = function() {
  return new Denote();
};
