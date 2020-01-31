var express = require('express');
var authorization = require('../middleware/authorization');
var router = express.Router();

raspberry_pi_controller = require('../controllers/raspberryPiController');

// Raspberry Pi Sense Hat
router.get('/rPiSenseHat', authorization.isUserAuthenticated, raspberry_pi_controller.SenseHat);

module.exports = router;