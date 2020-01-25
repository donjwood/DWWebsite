const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);

// Set global response properties
exports.setGlobalResProperties = async function (req, res, next) {

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