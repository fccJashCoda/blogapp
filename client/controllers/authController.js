const User = require('../models/user');

exports.get_login = (req, res) => {
  res.render('login');
};

exports.post_login = (req, res, next) => {
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
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.get_register = (req, res) => {
  res.render('register');
};

exports.post_register = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.render('register');
  }

  const newUser = new User({
    username,
    email,
    password,
  });

  newUser
    .save()
    // .then(() => res.redirect('/'))
    .then(() => res.redirect(307, '/login'))
    .catch((err) => {
      return res.render('404', { msg: err });
    });
};
