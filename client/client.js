const express = require('express');
const path = require('path');
const cors = require('cors');

// const passport = require('passport');
// const session = require('express-session');
// const initializePassport = require('./auth/auth');
// initializePassport(passport);

const app = express();
const port = 8000;

const router = require('./routes/router');
const blogController = require('./controllers/blogController');

// view engine
app.set('view engine', 'ejs');

// Middleware
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'public')));
// app.use(
//   session({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.use('/blog', router.blog);

app.get('/', (req, res) => {
  res.redirect('/blog');
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

// Server
app.listen(port, () => console.log(`Frontend running on port ${port}`));
