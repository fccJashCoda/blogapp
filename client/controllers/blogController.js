const axios = require('axios');
const proxy = 'http://localhost:5000';
const helper = require('../helper');

exports.get_blogs = (req, res) => {
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

exports.get_blog = (req, res) => {
  axios
    .get(`${proxy}/api/blog/${req.params.slug}`)
    .then(({ data: blog }) => {
      return res.render('blogpost', { ...blog, helper });
    })
    .catch((err) => res.json(err));
};
