var express = require('express');
var router = express.Router();
var storage = require('../lib/storage');

/* GET home page. */
router.get('/', function(req, res, next) {
  storage.get_all(function(err, notes) {
    if( err )  {
      next(err);
      return;
    }
    res.render('index', { title: 'Node Note', notes: notes });
  })

});

module.exports = router;
