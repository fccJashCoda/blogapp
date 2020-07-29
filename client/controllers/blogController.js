const axios = require('axios');
const proxy = 'http://localhost:5000';
const helper = require('../utils/helper');
const User = require('../models/user');

// @route GET login
// @desc display the login page
// @access public
exports.get_blogs = (req, res, next) => {
  if (req.params.page && !Number(req.params.page)) {
    return next();
  }
  const query = req.params.page > 0 ? req.params.page : '';

  axios
    .get(`${proxy}/api/blog/pages/${query}`)
    .then(({ data: blogs }) => {
      // console.log(blogs);
      const postCounter = blogs.blogCount
        ? `${blogs.blogCount} ${blogs.blogCount > 1 ? 'Posts' : 'Post'}`
        : 'No Posts';
      return res.render('index', { ...blogs, postCounter, helper });
    })
    .catch((err) => {
      console.log('error');
      return res.json(err);
    });
};

// @route GET login
// @desc display the login page
// @access public
exports.get_blog = (req, res, next) => {
  axios
    .get(`${proxy}/api/blog/${req.params.slug}`)
    .then(({ data: blog }) => {
      if (blog.error) {
        return next();
      }
      return res.render('blogpost', { ...blog, helper });
    })
    .catch((err) => res.json(err));
};

exports.put_slug_like = async (req, res, next) => {
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
};

exports.get_slug_comment = (req, res) => {
  res.render('blogComment');
};
