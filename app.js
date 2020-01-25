const createError = require('http-errors');
const express = require('express');
const exphbs = require('express-handlebars');
const allHbsHelpers = require('handlebars-helpers')();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const appMiddleware = require('./middleware/appMiddleware');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main', helpers: allHbsHelpers}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Set global response properties (needs to be before routers)
app.use(appMiddleware.setGlobalResProperties);

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
