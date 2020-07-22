const express = require('express');
const router = express.Router();

const { User } = require('../models/models');

// @route POST /register/
// @desc create a new user in the database
// @access public
router.post('/', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ error: 'Missing Information' });
  }

  const promises = [
    User.find({ username }).then((user) => (user.length ? true : false)),
    User.find({ email }).then((user) => (user.length ? true : false)),
  ];
  Promise.all(promises).then((results) => {
    const [foundUsername, foundEmail] = results;

    if (foundUsername || foundEmail) {
      return res.json({ error: 'Username or Email already taken' });
    }

    const newUser = new User({
      username,
      email,
      password,
    });
    newUser
      .save()
      .then(() => res.json({ msg: 'success' }))
      .catch((err) => console.log(err));
  });
});

// @route POST /register/login
// @desc user login
// @access public
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(async (user) => {
      if (!user) {
        return res.json({ error: 'User not found' });
      }

      if (!(await user.isValidPassword(password))) {
        console.log('password is not valid ');
        return res.json({ error: 'Invalid Password' });
      }
      return res.json({ msg: 'User logged in' });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
