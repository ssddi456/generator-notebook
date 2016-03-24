var path = require('path');
var express = require('express');
var util = require('util');
var fs = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



var storage = require('../lib/storage');
var uuid = require('../lib/uuid');

router.post('/add',function( req, res, next ) {
  storage.add(function(err, note) {
    if(err){
      next(err);
    } else {
      res.json(note);
    }
  });
});

router.post('*',function( req, res, next ) {
  var id = req.body.id;
  storage.get( id, function(err ,res ) {
    if( err )    {
      next(err);
      return;
    }
    if( res ){
      next();
      return;
    }
    res.json({
      error : 1,
      message : 'note not found'
    });
  });
});

router.post('/remove',function( req, res, next ) {
  storage.remove(req.body.id, function(err) {
    if( !err ){
      res.json({
        error : 0
      });
    } else {
      res.json({
        error : 1,
        message: 'remove failed'
      });
    }
  });
});

router.post('/save',function( req, res, next ) {
  var note = {};
  for(var k in req.body){
    if( k != 'id' && req.body.hasOwnProperty(k) ){
      note[k] = req.body[k];
    }
  }

  storage.update(req.body.id, note, function(err) {
    if( err ){
      res.json({
        error : 1,
        message : err
      });
    } else {
      res.json({
        error : 0
      });
    }
  });
});


var child_process = require('child_process');
var code_cache_path = path.join(__dirname,'../data/code_cache');

function exec_code ( code, done ) {
  try{
    var tmp_file_name = path.join(code_cache_path, uuid() + '.js');
    var records = 0;

    code = code.replace(/(?:\n)\s*note_exec\s*\((.*)\)/g, function($, $code ) {
        return '\nconsole.log(\''  + (++records) + ' : ' + $code.replace(/(['"])/g,'\\\\$1') + '\');\n'
              +'console.log('+ $code +');\n';
    });

    fs.writeFileSync(tmp_file_name, code);
    var cp = child_process.fork(tmp_file_name,{ silent : true});
  } catch(e){
    return done(e);
  }

  var stdout = [];
  var stderr = [];
  var exceptions = [];
  var out = {};

  cp.stdout.on('data',function( chunk ) {
    stdout.push(chunk);
  });

  cp.stderr.on('data',function( chunk ) {
    stderr.push(chunk);
  });

  cp.on('error',function( e ) {
    exceptions.push(e);
  });

  cp.on('exit',function( code ) {
    out.stdout = Buffer.concat(stdout).toString();
    out.stderr = Buffer.concat(stderr).toString();
    out.exceptions = exceptions;
    out.code = code;
    fs.unlinkSync(tmp_file_name);
    done(null, out);
  });
}

router.post('/exec',function( req, res, next ) {
  var note_id = req.body.id;

  storage.get(note_id, function( err, note ) {
    exec_code( 
      decodeURIComponent(note.code), 
      function( e, _res ) {
        if(e){
          res.json({
            error : 1,
            msg   : 'exec perpare failed',
            message : e.message + '\n' + e.stack
          });
        } else {
          var note = { res : _res };
          storage.update(note_id, note, function(err) {
            if( !err ){
              res.json({
                error : 0,
                res : _res
              });
            } else{
              res.json({
                error : 1,
                message:'res save failed',
                res : _res
              });
            }
          });
        }
      });
  });
});

module.exports = router;
