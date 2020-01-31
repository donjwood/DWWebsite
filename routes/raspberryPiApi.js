const express = require('express');
const router = express.Router();
const apiTokenAuth = require('../middleware/apiTokenAuthorization');

//Require controller
raspberryPiApiController = require('../controllers/raspberryPiApiController');

//GET home page.
router.get('/getsensehatdata', [apiTokenAuth.isValidToken], raspberryPiApiController.getSenseHatData);

module.exports = router;