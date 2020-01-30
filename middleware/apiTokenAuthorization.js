const jwt = require('jsonwebtoken');

const config = require('../config');

//See if the token is valid
exports.isValidToken = function (req, res, next) {

    let token = req.headers['x-access-token'];

    if (token == undefined) {
        var err = new Error('No token provided.');
        err.status = 401;
        return next(err);
    }

    jwt.verify(token, config.apiToken.secret, function(err, decoded) {
        if (!err) {
            return next();
        } else {
            err.status = 401;
            return next(err);
        }
    });
};

//See if the token is a valid admin token
exports.isAdmin = function (req, res, next) {

    let token = req.headers['x-access-token'];

    if (token == undefined) {
        var err = new Error('No token provided.');
        err.status = 401;
        return next(err);
    }

    jwt.verify(token, config.apiToken.secret, function(err, decoded) {
        if (!err) {

            //Check if the token is an admin token
            if (decoded.user.isAdmin)
            {
                return next();
            } else {
                var err = new Error('Admin token required.');
                err.status = 401;
                return next(err);
            }
        } else {
            err.status = 401;
            return next(err);
        }
    });
};

//See if the token is a valid admin token
exports.isCurrentUserOrAdmin = function (req, res, next) {

    let token = req.headers['x-access-token'];

    if (token == undefined) {
        var err = new Error('No token provided.');
        err.status = 401;
        return next(err);
    }

    //Get the user ID
    let userId = req.params.userId;

    if (userId == undefined) {
        var err = new Error('No :userID param in route.');
        err.status = 401;
        return next(err);
    }

    jwt.verify(token, config.apiToken.secret, function(err, decoded) {
        if (!err) {

            //Check if the token is an admin token
            if (decoded.user.id == userId ||
                decoded.user.isAdmin)
            {
                return next();
            } else {
                var err = new Error('Admin token required.');
                err.status = 401;
                return next(err);
            }
        } else {
            err.status = 401;
            return next(err);
        }
    });
};