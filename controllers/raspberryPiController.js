const config = require('../config');

// Home page of the site.
exports.SenseHat = function (req, res, next) {
    res.render('rPiSenseHat', { 
        title: 'Raspberry Pi Sense Hat'
    });
};