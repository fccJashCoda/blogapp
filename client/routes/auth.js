const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  checkIsAuthenticated,
  checkNotAuthenticated,
} = require('../auth/utils');

// @route GET /login
// @desc display the login page
// @access public
router.get('/login', checkNotAuthenticated, authController.get_login);

// @route POST /login
// @desc authenticate user and log him in
// @access public
router.post('/login', checkNotAuthenticated, authController.post_login);

// @route POST /logout
// @desc logout the user
// @access private user
router.post('/logout', checkIsAuthenticated, authController.logout);

// @route GET /register
// @desc display the register page
// @access public
router.get('/register', checkNotAuthenticated, authController.get_register);

// @route POST /register
// @desc register the user in the database
// @access public
router.post('/register', checkNotAuthenticated, authController.post_register);

module.exports = router;
