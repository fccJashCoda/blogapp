const User = require("../models/user");

exports.get_login = (req, res) => {
  res.render("login");
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};

exports.get_register = (req, res) => {
  res.render("register");
};

exports.post_register = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.render("register");
  }

  const newUser = new User({
    username,
    email,
    password,
  });

  newUser
    .save()
    // .then(() => res.redirect('/'))
    .then(() => res.redirect(307, "/login"))
    .catch((err) => {
      return res.render("404", { msg: err });
    });
};
