import to from 'await-to-js';
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookie from 'cookie'
import cookieParser from 'cookie-parser'
import path from 'path'
import rndString from 'randomstring'
import fs from 'fs'
import multer from 'multer'
import m from 'moment-timezone'
import morgan from 'morgan'
import favicon from 'serve-favicon'

let passport = require('./passport')();

var app = express();
var debug = require('debug')('dicon:server');
var router = express.Router();
var rndString = require("randomstring");
var multer = require('multer');
var moment = require('moment-timezone');
const morgan = require('morgan');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//export settting
import {Users, Words, Mydics, Boards} from './mongo'; //mongodb
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
var auth = require('./routes/auth')(router, rndString, passport, func, Users);
var word = require('./routes/word')(router, func, Words, to);
var version = require('./routes/version')(router);
var mydic = require('./routes/mydic')(router, func);
var board = require('./routes/board')(router, moment, rndString, func);
var quize = require('./routes/quize')(router);
var image = require('./routes/image')(router);
var my = require('./routes/my')(router, func, Users);
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
