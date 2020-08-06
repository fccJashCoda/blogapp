const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

const { checkIsAuthenticated } = require('../auth/utils');

// @route GET /
// @desc redirects to the main blog page
// @access public
router.get('/', (req, res) => {
  res.redirect('/blog/');
});

// @route GET /blog/:page?
// @desc display all blog articles (paginated)
// @access public
router.get('/blog/:page?', blogController.get_blogs_v2);

// @route POST /:slug/like
// @desc allows liking a blog if user is authenticated
// @access private
router.post(
  '/:slug/like',
  checkIsAuthenticated,
  blogController.post_slug_like_v2
);

// @route GET /:slug/comment
// @desc display the comment page
// @access private
router.get(
  '/:slug/comment',
  checkIsAuthenticated,
  blogController.get_slug_comment
);

// @route POST /:slug/comment
// @desc post a comment if user is authenticated
// @access private
router.post(
  '/:slug/comment',
  checkIsAuthenticated,
  blogController.post_slug_comment
);

// @route GET /:slug
// @desc display a specific article
// @access public
router.get('/:slug', blogController.get_blog);

module.exports = router;
