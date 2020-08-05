const axios = require('axios');
const proxy = 'http://localhost:5000';
const helper = require('../utils/helper');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

// @route GET /blog/:page?
// @desc redirects to the main blog page
// @access public
exports.get_blogs = (req, res, next) => {
  if (req.params.page && !Number(req.params.page)) {
    return next();
  }
  const query = req.params.page > 0 ? req.params.page : '';

  axios
    .get(`${proxy}/api/blog/pages/${query}`)
    .then(({ data: blogs }) => {
      const postCounter = blogs.blogCount
        ? `${blogs.blogCount} ${blogs.blogCount > 1 ? 'Posts' : 'Post'}`
        : 'No Posts';
      return res.render('index', { ...blogs, postCounter, helper });
    })
    .catch((err) => {
      return res.json(err);
    });
};

// @route GET /:slug
// @desc display a specific article
// @access public
exports.get_blog = async (req, res, next) => {
  try {
    const results = await axios.get(`${proxy}/api/blog/${req.params.slug}`);
    const { blog, comments } = results.data;
    if (!blog) return next();
    const commentCounter = comments.length
      ? `${comments.length} ${comments.length > 1 ? 'Comments' : 'Comment'}`
      : 'No comments';
    return res.render('blogpost', { blog, comments, commentCounter, helper });
  } catch (error) {
    console.log(error);
    return res.render('404', { status: '500', msg: 'Server Error' });
  }
};

// @route POST /:slug/like
// @desc allows liking a blog if user is authenticated
// @access private
exports.post_slug_like = async (req, res, next) => {
  User.findById(res.locals.user.id)
    .then(async (user) => {
      if (!user) {
        return res.render('404', { msg: 'Server Error' });
      }
      user.addLikedPost(req.params.slug);
      axios
        .put(`http://localhost:5000/api/blog/${req.params.slug}/like`)
        .catch((err) => next(err));
      return res.redirect(`/${req.params.slug}`);
    })
    .catch((err) => res.render('404', { status: '500', msg: 'Server Error' }));
};

// @route GET /:slug/comment
// @desc display the comment page
// @access private
exports.get_slug_comment = (req, res) => {
  res.render('blogComment', { slug: req.params.slug, blogId: req.query.id });
};

// @route POST /:slug/comment
// @desc post a comment if user is authenticated
// @access private
exports.post_slug_comment = [
  body('editor').not().isEmpty().withMessage('No empty posts allowed'),

  async (req, res, next) => {
    const errors = validationResult(req);
    const { editor, slug, blogId } = req.body;
    if (!errors.isEmpty()) {
      res.render('blogComment', {
        slug,
        blogId,
        messages: { error: errors.errors[0].msg },
      });
    }
    const payload = {
      author: res.locals.user.username,
      authorId: res.locals.user.id,
      commentBody: editor,
      blogId,
    };
    const post = await axios.post(`${proxy}/api/blog/newblogcomment`, {
      payload,
    });
    if (!post.data.success) {
      res.render('404', { status: '500', msg: 'Server Error' });
    }
    res.redirect(`/${slug}`);
  },
];
