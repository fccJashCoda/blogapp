const express = require("express");
const router = express.Router();
const { authController } = require("../controllers/controllers");
const { checkNotAuthenticated } = require("../auth/utils");

// @route GET /login
// @desc display the login page
// @access public
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

// @route POST /login
// @desc user login
// @access public
// router.post(
//   "/login",
//   checkNotAuthenticated,
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

// router.get('/success', (req, res) => {
//   console.log('logged in');
//   res.redirect('/noodle');
// });

module.exports = router;
