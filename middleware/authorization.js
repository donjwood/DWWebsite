
//See if the user is authenticated
exports.isUserAuthenticated = function (req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        //Redirect to the login if they aren't logged in.
        req.session.loginRedirectUrl = req.originalUrl
        res.redirect('/login');
    }
};

//See if the user is an admin
exports.isUserAdmin = function (req, res, next) {
    if (req.session && req.session.user) {
        if (req.session.user.isAdmin) {
            return next();
        } else {
            var err = new Error('You are not authorized to view this page.');
            err.status = 401;
            return next(err);
        }
    } else {
        var err = new Error('You are not authorized to view this page.');
        err.status = 401;
        return next(err);
    }
};