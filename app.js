var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
require('dotenv').config();


//connect to database
const mongodb = process.env.mongo_URI
mongoose.connect(mongodb,{useUnifiedTopology:true,useNewUrlParser:true});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'mongo connection error'));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const User = require('./models/User');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/usr', usersRouter);

module.exports = app;