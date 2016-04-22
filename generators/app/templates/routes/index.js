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
var globals = fs.readFileSync(path.join(__dirname, './globals.js'),'utf8');

/* GET home page. */
router.get('/', function(req, res, next) {

  storage.get_all(function(err, notes) {
    if( err )  {
      next(err);
      return;
    }
    res.render('index', { 
      title: 'Node Note', 
      notes: notes,
      global_code: globals
    });
  })

});

module.exports = router;
