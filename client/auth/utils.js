function checkIsAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
}

module.exports = {
  checkIsAuthenticated,
  checkNotAuthenticated,
};
