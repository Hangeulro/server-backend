var http = require('http');
var express = require('express');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var path = require('path');
var bodyParser = require('body-parser');
var vhost = require('vhost');
var app = express();
var server = http.createServer(app);
var debug = require('debug')('dicon:server');
var rndString = require("randomstring");
var fs = require('fs');
var router = express.Router();
var passport = require('passport');

var db = require('./mongo');

var port = normalizePort(process.env.PORT || '3000');

//set engin
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//router setting
var index = require('./routes/index')(router);
var auth = require('./routes/auth')(router, rndString, passport);
var word = require('./routes/word');
var version = require('./routes/version');
var mydic = require('./routes/mydic');
var board = require('./routes/board');
var quize = require('./routes/quize');
var image = require('./routes/image');
var my = require('./routes/my');
var today = require('./routes/today');


//router
app.use('/', index);
app.use('/auth', auth);
app.use('/word', word);
app.use('/version', version);
app.use('/mydic', mydic);
app.use('/board', board);
app.use('/image', image);
app.use('/quize', quize);
app.use('/my', my);
app.use('/today', today);



//create server
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


//socket


//error handle
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
      throw error;
  }

  var bind = typeof port === 'string' ?
      'Pipe ' + port :
      'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
      case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
      case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
      default:
          throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
      'pipe ' + addr :
      'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
