const axios = require('axios');
const proxy = 'http://localhost:5000';
const helper = require('../utils/helper');
const User = require('../models/user');
const BlogComment = require('../models/blogComment');

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
        .then((comments) => {
          return res.render('blogpost', { ...blog, comments, helper });
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
      return next();
    })
    .catch((err) => res.render('404', { msg: 'Server Error' }));
};

exports.get_slug_comment = (req, res) => {
  res.render('blogComment', { slug: req.params.slug, blogid: req.query.id });
};

exports.post_slug_comment = (req, res, next) => {
  const { editor, slug, blogid } = req.body;
  console.log(editor);
  console.log(slug);
  console.log(blogid);

  const comment = new BlogComment({
    author: res.locals.user.id,
    body: editor,
    blogPostId: blogid,
  });

  comment
    .save()
    .then(() => res.redirect(`/${slug}`))
    .catch((err) => next(err));
};
