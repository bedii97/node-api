var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var movieRouter = require('./routes/movie');
var directorRouter = require('./routes/director');

var app = express();

//db connection
const db = require('./helper/db')(); //sondaki parantez sayesinde otomatik olarak çalıştırmış olduk
//Config
const config = require('./config');
app.set('api_secret_key', config.api_secret_key);
//Middleware
const verifyToken = require('./middleware/verify_token');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', verifyToken);
app.use('/api/movies', movieRouter);
app.use('/api/directors', directorRouter);

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
  res.json({error: {message: err.message, code: err.code}});
});

module.exports = app;
