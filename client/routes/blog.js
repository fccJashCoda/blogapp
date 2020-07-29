const express = require('express');
const router = express.Router();
const { blogController } = require('../controllers/controllers');

const {
  checkIsAuthenticated,
  checkNotAuthenticated,
} = require('../auth/utils');

router.get('/', (req, res) => {
  res.redirect('/blog/');
});

// @route GET /blog/:page?
// @desc redirects to the main blog page
// @access public
router.get('/blog/:page?', blogController.get_blogs);

// @route POST /:slug/like
// @desc allows liking a blog if user is authenticated
// @access private
router.put('/:slug/like', checkIsAuthenticated, blogController.put_slug_like);

// @route POST /:slug/comment
// @desc allows posting a comment if user is authenticated
// @access private
router.get(
  '/:slug/comment',
  checkIsAuthenticated,
  blogController.get_slug_comment
);

// @route POST /:slug
// @desc display a specific article
// @access public
router.get('/:slug', blogController.get_blog);

module.exports = router;
