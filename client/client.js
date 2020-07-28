if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('express-flash');
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
const axios = require('axios');

const { checkIsAuthenticated, checkNotAuthenticated } = require('./auth/utils');

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
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user
    ? {
        username: req.user.username,
        email: req.user.email,
        id: req.user._id,
        liked: req.user.likedPosts,
      }
    : '';
  next();
});

// Routes
app.use('/blog', router.blog);
app.use('/auth', router.auth);

// @route GET /
// @desc redirects to the main blog page
// @access public
app.get('/', (req, res) => {
  res.redirect('/blog');
});

// @route POST /logout
// @desc logout the user
// @access private user
app.post('/logout', checkIsAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/');
});

// @route GET /register
// @desc display the register page
// @access public
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register');
});

// @route POST /register
// @desc register the user in the database
// @access public
app.post('/register', checkNotAuthenticated, (req, res) => {
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
});

app.get('/test', (req, res) => {
  res.render('postComment');
});

// @route POST /:slug/like
// @desc allows liking a blog if user is authenticated
// @access private
app.put('/:slug/like', checkIsAuthenticated, async (req, res, next) => {
  User.findById(res.locals.user.id)
    .then(async (user) => {
      if (!user) {
        return res.render('404', { msg: 'Server Error' });
      }
      user.addLikedPost(req.params.slug);
      axios
        .put(`http://localhost:5000/api/blog/${req.params.slug}/like`)
        .catch((err) => next(err));
      return next();
    })
    .catch((err) => res.render('404', { msg: 'Server Error' }));
});

// @route POST /:slug/comment
// @desc allows posting a comment if user is authenticated
// @access private
app.get('/:slug/comment', checkIsAuthenticated, (req, res) => {
  res.render('blogComment');
});

// @route POST /:slug
// @desc display a specific article
// @access public
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
