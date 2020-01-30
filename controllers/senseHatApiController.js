var senseHat = require ('../raspberry_pi/senseHat.js');

// Return SenseHatData as JSON
exports.getSenseHatData = function (req, res, next) {

    //Use the promise to render the page on success
    senseHat.getSenseHatData().then(function(result) {
        res.json(result);
    },
    function(err) {
        console.log(err);
    });
};