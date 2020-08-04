const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkIsAuthenticated } = require('../auth/utils');

// @route GET /:username
// @desc display a users profile
// @access public
router.get('/:username', userController.get_user_profile);

// @route GET /account/:username
// @desc display a users account
// @access private
router.get(
  '/account/:username/',
  checkIsAuthenticated,
  userController.get_user_account
);

module.exports = router;
