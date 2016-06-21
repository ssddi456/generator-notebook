var express = require('express');
var path = require('path');
var logger = require('morgan');

var bodyParser = require('body-parser');
var routes = require('./routes/index');
var note = require('./routes/note');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('env', 'development');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var credentialsRegExp = /^ *basic +([a-z0-9\-\._~\+\/]+=*) *$/i

app.use(function( req, resp, next ) {
  function failed() {
    resp.set('WWW-Authenticate', 'Basic realm="User Visible Realm"');
    resp.sendStatus(401);
  }
  function decodeBase64(str) {
    return new Buffer(str, 'base64').toString()
  }
  var headers = req.headers;
  if( !headers.authorization ){
    return failed();
  }
  var match = headers.authorization.match(credentialsRegExp);
  if( !match ){
    return failed()
  }
  var authorization = decodeBase64(match[1]);

  var spliter = authorization.indexOf(':');

  var user = authorization.slice(0, spliter);
  var pass = authorization.slice(spliter + 1);

  if( "<%- props.server_user_name%>" != user 
    || "<%- props.server_user_pass%>" != pass 
  ){
    return failed();
  }

  next();
});

app.use('/', routes);
app.use('/note', note);

app.use('/restart', function( req, resp ){
  resp.end('okey');
  setTimeout(function() {
    process.exit(3);
  },1e3);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if( req.xhr ){
      res.json({
        error : err.status || 1,
        message : err.message ||err,
        stack : err.stack
      })
    } else {
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
