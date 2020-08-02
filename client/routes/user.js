const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkIsAuthenticated } = require('../auth/utils');

router.get('/:username', checkIsAuthenticated, userController.get_user_profile);

router.get(
  '/account/:username/',
  checkIsAuthenticated,
  userController.get_user_account
);

module.exports = router;
