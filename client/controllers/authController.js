const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.get_login = (req, res) => {
  res.render('login');
};

exports.post_login = [
  body('email').trim().isEmail().withMessage('Invalid Email').escape(),
  body('password').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { messages: { error: errors.errors[0].msg } });
    }
    let passport = req.app.get('passport');
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.render('login', { messages: { error: info.message } });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect('/');
      });
    })(req, res, next);
  },
];

exports.logout = (req, res) => {
  req.logout();
  res.redirect('../');
};

exports.get_register = (req, res) => {
  res.render('register');
};

exports.post_register = [
  body('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please enter a valid username.')
    .custom((value) => !/\s/.test(value))
    .withMessage('Whitespaces are not allowed')
    .custom(async (value) => {
      const foundUser = await User.findOne({ username: value });
      if (foundUser !== null) return Promise.reject();
    })
    .withMessage('Username already in use.')
    .escape(),
  body('email')
    .custom(async (value) => {
      const foundUser = await User.findOne({ email: value });
      if (foundUser !== null) return Promise.reject();
    })
    .withMessage('Email already in use')
    .trim()
    .isEmail()
    .withMessage('Invalid email')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long.')
    .escape(),
  (req, res) => {
    const { username, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register', {
        messages: { error: errors.errors[0].msg },
      });
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    newUser
      .save()
      .then(() => res.redirect(307, '/auth/login'))
      .catch((err) => {
        return res.render('404', { msg: err });
      });
  },
];
