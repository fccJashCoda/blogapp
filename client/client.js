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
// const blogController = require("./controllers/blogController");
const { blogController, authController } = require('./controllers/controllers');
const User = require('./models/user');
const axios = require('axios');

const { checkIsAuthenticated, checkNotAuthenticated } = require('./auth/utils');

// view engine
app.set('view engine', 'ejs');
app.set('passport', passport);

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
app.use('/', router.blog);
app.use('/auth', router.auth);

app.get('/test', (req, res) => {
  res.render('postComment');
});

// @route POST /:slug/like
// @desc allows liking a blog if user is authenticated
// @access private
app.put('/:slug/like', checkIsAuthenticated, blogController.put_slug_like);

// @route POST /:slug/comment
// @desc allows posting a comment if user is authenticated
// @access private
app.get(
  '/:slug/comment',
  checkIsAuthenticated,
  blogController.get_slug_comment
);

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
