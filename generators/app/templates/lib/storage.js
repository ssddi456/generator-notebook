var fs = require('fs');
var path = require('path');
var nedb = require('nedb');

var storage = new nedb({ 
                  filename : path.join(__dirname, '../data/storage.db'),
                  autoload : true
                });

module.exports = {
  add : function( done ) {
    var note = {
      timestamp : Date.now(),
      name : 'untitled',
      code : '',
      res  : {}
    };
    storage.insert(note, done);
  },

  get : function( id, done ){
    storage.findOne({
      _id : id
    }, done);
  },

  get_all : function( done ) {
    storage.find(done);
  },

  update : function( id, data, done ){
    var updates = {};
    for(var k in data){
      if( typeof updates != 'object' ){
        updates[k] = data[k]
      } else {
        for(var m in data[k] ){
          updates[k + '.' + m ] = data[k][m];
        }
      }
    }

    storage.update({ _id : id }, { $set : data }, done);
  },

  remove : function( id, done ) {
    storage.remove({ _id : id },done);
  }

};