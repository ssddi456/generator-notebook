var express = require('express');
var router = express.Router();
var storage = require('../lib/storage');

var path    = require('path');
var debug_name = path.basename(__filename,'.js');
if( debug_name == 'index'){
  debug_name = path.basename(__dirname);
}
(require.main === module) && (function(){
    process.env.DEBUG = '*';
})()

var fs = require('fs');
var debug = require('debug')(debug_name);
var async = require('async');
/* GET home page. */
router.get('/', function(req, res, next) {

  async.auto({
    init_bootstrap : function( done, res ) {
      storage.get_bootstrap(done);
    },
    init_notes : function( done, res ) {
      storage.get_all(done);
    }
  }, function( err, notes_info ) {
    if(err){
      return next(err);
    }
    res.render('index', { 
      title: 'Node Note', 
      notes: notes_info.init_notes,
      bootstrap: notes_info.init_bootstrap
    });
  });
});

module.exports = router;
