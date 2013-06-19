
/**
 * Module dependencies.
 */

var mini = require('infinite')
  , should = require('should');

module.exports = {
  'test .version': function(){
    infinite.version.should.match(/^\d+\.\d+\.\d+$/);
  }
};