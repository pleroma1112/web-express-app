require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
const helmet = require('helmet')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const rfs = require('rotating-file-stream')

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const apiRouter = require('./routes/api/api')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.set('trust proxy', 'nginx')

app.use(helmet())
app.use(logger('combined'));
let accessLogStream = rfs.createStream('access.log',{
  interval : '1d',
  path : path.join(__dirname, '../log')
})
app.use(logger('combined', { stream : accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api',apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
