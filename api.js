if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

const router = require('./routes/router');

// === NOTES ===
// implement an errorHandler function

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/blog', router.blog);
app.use('/api/register', router.user);

app.get('/', (req, res) => {
  res.redirect('/api/blog');
});

app.get('/cookies', (req, res) => {
  res.json({ msg: 'You found the cookie jar!' });
});

// @route - any - 404
// @desc handle 404
// @access public
app.use((req, res) => {
  res.json({ error: '404 - Item not found' });
});

// Server
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('db connected'))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Api listening on port ${port}.`);
});
