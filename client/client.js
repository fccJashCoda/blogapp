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
const axios = require('axios');
const helper = require('./utils/helper');

const app = express();
const port = 8000;

const router = require('./routes/router');

// Cache
let cachedTopFiveData;
let cachedTopFiveDataTime;

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
app.use(async (req, res, next) => {
  if (cachedTopFiveData && cachedTopFiveDataTime > Date.now() - 300000) {
    res.locals.topFive = cachedTopFiveData;
    return next();
  }
  try {
    const { data } = await axios.get('http://localhost:5000/api/blog/topFive');
    const topFive = [];
    data.topFive.forEach((item, index) => {
      topFive[index] = {
        title: item.title,
        slug: item.slug,
        pubDate: helper.humanReadableDate(item.publishedDate),
      };
    });
    cachedTopFiveData = topFive;
    cachedTopFiveDataTime = Date.now();
    res.locals.topFive = topFive;
    next();
  } catch (error) {
    next();
  }
});

// Routes
app.use('/', router.blog);
app.use('/auth', router.auth);
app.use('/user', router.user);

// 404
app.use((req, res) => {
  res.render('404', { status: '404', msg: ' - Page Not Found' });
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
