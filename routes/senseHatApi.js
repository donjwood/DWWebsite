const express = require('express');
const router = express.Router();
const apiTokenAuth = require('../middleware/apiTokenAuthorization');

//Require controller
senseHatApiController = require('../controllers/senseHatApiController');

//GET home page.
router.get('/getsensehatdata', [apiTokenAuth.isValidToken], senseHatApiController.getSenseHatData);

module.exports = router;