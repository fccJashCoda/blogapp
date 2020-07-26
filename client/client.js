if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const passport = require('passport');
const session = require('express-session');
const initializePassport = require('./auth/auth');
initializePassport(passport);

const app = express();
const port = 8000;

const router = require('./routes/router');
const blogController = require('./controllers/blogController');
const User = require('./models/user');

// view engine
app.set('view engine', 'ejs');

// Middleware
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user
    ? { username: req.user.username, email: req.user.email }
    : '';
  next();
});

// Routes
app.use('/blog', router.blog);

// @route GET /
// @desc redirects to the main blog page
// @access public
app.get('/', (req, res) => {
  // if (req.session) {
  //   console.log(req.session);
  // }
  console.log(res);
  res.redirect('/blog');
});

// @route GET /login
// @desc display the login page
// @access public
app.get('/login', (req, res) => {
  res.render('login');
});

// @route POST /login
// @desc user login
// @access public
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

// @route POST /logout
// @desc logout the user
// @access private user
app.post('/logout', (req, res) => {
  console.log(req.user);
  req.logout();
  console.log(req.user);
  res.redirect('/');
});

// @route GET /register
// @desc display the register page
// @access public
app.get('/register', (req, res) => {
  res.render('register');
});

// @route POST /register
// @desc register the user in the database
// @access public
app.post('/register', (req, res) => {
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
    .then(() => res.redirect('/'))
    .catch((err) => {
      return res.render('404', { msg: err });
    });
});

app.get('/about', (req, res) => {
  res.send('About');
});
app.get('/contact', (req, res) => {
  res.send('Contact');
});
app.get('/test', (req, res) => {
  res.render('404', { msg: 'Hey there' });
});

app.get('/:slug', blogController.get_blog);

// 404
app.use((req, res) => {
  res.render('404', { msg: '404 - Page Not Found' });
});

// client db
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('clientDB connected'))
  .catch((err) => console.log(err));

// Server
app.listen(port, () => console.log(`Frontend running on port ${port}`));
