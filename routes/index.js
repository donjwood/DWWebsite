var express = require('express');
var authorization = require('../middleware/authorization');
var router = express.Router();

// Require controllers
index_controller = require('../controllers/indexController');
user_controller = require('../controllers/userController');

// GET home page.
router.get('/', index_controller.index);

//Login page.
router.get('/login', user_controller.login);
router.post('/login', user_controller.login_post);

//Logout page
router.get('/logout', user_controller.logout)

module.exports = router;
