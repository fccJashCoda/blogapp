const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { checkIsAuthenticated } = require("../auth/utils");

router.get("/:username", checkIsAuthenticated, userController.get_user_profile);

module.exports = router;
