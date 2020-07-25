const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = async function (passport) {
  const authenticateUser = async (email, password, done) => {
    User.findOne({ email })
      .then(async (user) => {
        if (!user) {
          return done(null, false, {
            message: 'No user with this email found.',
          });
        }
        const validPassword = await user.isValidPassword(password);
        if (!validPassword) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((foundUser) => done(null, foundUser))
      .catch((err) => done(err));
  });
};
