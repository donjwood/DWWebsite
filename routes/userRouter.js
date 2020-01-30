var express = require('express');
var authorization = require('../middleware/authorization');
var router = express.Router();

user_controller = require('../controllers/userController');

//Change password page.
router.get('/changePassword', authorization.isUserAuthenticated, user_controller.changePassword);

//Edit user page
router.get('/editUser', authorization.isUserAuthenticated, user_controller.editUser);

//Manage users page
router.get('/manageUsers', [authorization.isUserAuthenticated, authorization.isUserAdmin], user_controller.manageUsers);

//Registration page.
router.get('/createUser', [authorization.isUserAuthenticated, authorization.isUserAdmin], user_controller.createUser);

module.exports = router;