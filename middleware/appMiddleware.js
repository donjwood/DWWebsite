const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const { User } = require('../initOrmModels');

// Set global response properties
exports.setGlobalResProperties = async function (req, res, next) {

    //See if there is a user object
    if (req.session && req.session.user) {
        //Get the user
       let user = await User.findByPk(req.session.user.id);
       
       //Refresh it in session and assign it to the res.locals.
       user.password = '';
       req.session.user = user;
       res.locals.user = req.session.user.dataValues;
    } 

    // Loop through all the files in the build folder
    res.locals.builtJsFiles = await readdir(path.join(__dirname, '../public/build'));

    return next();
};

// Handle errors
exports.errorHandler = function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if (!req.is('json')) {
        res.render('error', {
            title: 'Error',
            session: req.session
        });
    } else {
        res.json({
            errorMessage: err.message,
            error: req.app.get('env') === 'development' ? err : {}
        });
    }
};