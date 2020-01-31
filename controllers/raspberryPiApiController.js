var raspberriPiApi = require ('../raspberry_pi/raspberryPiApi.js');

// Return SenseHatData as JSON
exports.getSenseHatData = function (req, res, next) {

    raspberriPiApi.getSenseHatData().then(function(result) {
        res.json(result);
    },
    function(err) {
        console.log(err);
    });
};