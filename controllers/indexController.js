const config = require('../config');

//Home page of the site.
exports.index = function (req, res, next) {
    res.render('index', { 
        title: 'DJW'
    });
};