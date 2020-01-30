const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { User } = require('../initOrmModels');
const jwt = require("jsonwebtoken");

const config = require('../config');

//Login page
exports.login = function (req, res, next) {
    //Check if the user is logged in
    if(req.session.user) {
        //Redirect to home since user is logged in.
        res.redirect('/');
    } else {
        res.render('login', {
            title: 'Login',
            session: req.session
        });
    }
};

exports.login_post = async function (req, res, next) {

    try {

        //Authenticate the user
        let user = await User.authenticate(req.body.txtUserName, req.body.txtPassword);
        if (user != undefined) {

            //Remove the password for things that make it to the client
            user.password = '';

            //Load the user into session.
            req.session.user = user;

            let payload = {
                user: user
            };
            let token = jwt.sign(payload, config.apiToken.secret, config.apiToken.options);

            res.cookie('DWWebsite_token', token, {maxAge: 86400000});
            res.cookie('DWWebsite_user', JSON.stringify(user), {maxAge: 86400000});

            if (req.session.loginRedirectUrl) {
                var redirectUrl = req.session.loginRedirectUrl;
                req.session.loginRedirectUrl = undefined;
                res.redirect(redirectUrl);
            } else {
                res.redirect('/');
            }
        } else {
            res.render('login', {
                title: 'Login',
                body: req.body,
                errorMessage: "Invalid username or password."
            });
        }
    } catch(err) {
        console.log(err);
        this.errorMessage = err;
    }     
};

//Logout (no page, redirects to login)
exports.logout = function (req, res, next) {
    if (req.session) {
        //Logout by destroying the session
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                res.clearCookie("DWWebsite_token");
                res.clearCookie('DWWebsite_user');
                return res.redirect('/login');
            }
        });
    }
}

//Password change page.
exports.changePassword = function (req, res, next) {
    res.render('changePassword', {
        title: 'Change Password'
    });
}

//Edit the user profile
exports.editUser = function (req, res, next) {
    res.render('editUser', {
        title: 'Edit User',
    });
}

//Manage Users page
exports.manageUsers = function (req, res, next) {
        
    res.render('manageUsers', {
        title: 'Manage Users'
    });

}

//Create user page
exports.createUser = function (req, res, next) {
    res.render('pages/createUser', {
        title: 'Create User'
     });
};
