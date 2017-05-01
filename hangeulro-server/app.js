var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var path = require('path');
var favicon = require('serve-favicon');
var debug = require('debug')('dicon:server');
var rndString = require("randomstring");
var fs = require('fs');
var router = express.Router();
var passport = require('passport');
var rndString = require("randomstring");
var multer = require('multer');
var moment = require('moment-timezone');
const morgan = require('morgan');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//serialize

passport.serializeUser(function(user, done) {done(null, user);});
passport.deserializeUser(function(obj, done) {done(null, obj);});

//export settting
var db = require('./mongo'); //mongodb
var func = require('./func'); //functions

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
var auth = require('./routes/auth')(router, rndString, passport, func, db.Users);
var word = require('./routes/word')(router, func);
var version = require('./routes/version')(router);
var mydic = require('./routes/mydic')(router, func);
var board = require('./routes/board')(router, moment, rndString, func);
var quize = require('./routes/quize')(router);
var image = require('./routes/image')(router);
var my = require('./routes/my')(router, func, db.Users);
var today = require('./routes/today')(router, moment);

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


module.exports = app;
