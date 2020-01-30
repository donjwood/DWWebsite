const createError = require('http-errors');
const express = require('express');
const exphbs = require('express-handlebars');
const allHbsHelpers = require('handlebars-helpers')();
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');

const config = require('./config');
const appMiddleware = require('./middleware/appMiddleware');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');
const userApiRouter = require('./routes/userApi');

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

// Set up sessions
// Use dialect to determine the correct database for the session
if (config.session.db.dialect == 'postgres') {

    // PostgreSQL
    // Should default to settings on Heroku.
    app.use(session({
        store: new (require('connect-pg-simple')(session))(),
        secret: config.session.secret,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
    }));

} else {

    // Default to SQLite if nothing else.
    app.use(session({
        store: new require('connect-sqlite3')(session)({
            db: config.session.db.sqliteFileName,
            dir: config.session.db.sqliteDirectory
        }),
        secret: config.session.secret,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
    }));

}

// Set global response properties (needs to be before routers)
app.use(appMiddleware.setGlobalResProperties);

// Set up routers
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/userapi', userApiRouter);

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

//Initialize the models on application load.
const { User } = require('./initOrmModels');

module.exports = app;
