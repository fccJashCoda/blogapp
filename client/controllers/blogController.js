const axios = require('axios');
const proxy = 'http://localhost:5000';
const helper = require('../utils/helper');
const User = require('../models/user');
const BlogComment = require('../models/blogComment');
const { body, validationResult } = require('express-validator');

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

exports.get_blog = (req, res, next) => {
  axios
    .get(`${proxy}/api/blog/${req.params.slug}`)
    .then(({ data: blog }) => {
      if (blog.error) {
        return next();
      }
      BlogComment.find({ blogPostId: blog.blog._id })
        .populate('author', 'username')
        .sort({ createdAt: -1 })
        .then((comments) => {
          const commentCounter = comments.length
            ? `${comments.length} ${
                comments.length > 1 ? 'Comments' : 'Comment'
              }`
            : 'No comments';
          return res.render('blogpost', {
            ...blog,
            comments,
            commentCounter,
            helper,
          });
        })
        .catch((err) => next(err));
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
      return res.redirect(`/${req.params.slug}`);
    })
    .catch((err) => res.render('404', { msg: 'Server Error' }));
};

exports.get_slug_comment = (req, res) => {
  res.render('blogComment', { slug: req.params.slug, blogid: req.query.id });
};

exports.post_slug_comment = [
  body('editor').not().isEmpty().withMessage('No empty posts allowed'),

  (req, res, next) => {
    const errors = validationResult(req);
    const { editor, slug, blogid } = req.body;
    if (!errors.isEmpty()) {
      res.render('blogComment', {
        slug,
        blogid,
        messages: { error: errors.errors[0].msg },
      });
    }

    const comment = new BlogComment({
      author: res.locals.user.id,
      body: editor,
      blogPostId: blogid,
    });

    comment
      .save()
      .then(() => res.redirect(`/${slug}`))
      .catch((err) => next(err));
  },
];
