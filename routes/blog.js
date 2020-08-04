const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogApiController');

// @route GET /blog/all
// @desc return all articles
// @access public
router.get('/all', blogController.get_all_blogs);

// @route GET /blog/topFive
// @desc return 5 most read articles
// @access public
router.get('/topFive', blogController.get_top_five_blogs);

// @route POST /blog/newblogcomment
// @desc add a blog comment to the db
// @access public
router.post('/newblogcomment', blogController.post_new_blog_comment);

// @route GET /blog/pages/:page?
// @desc return last n published articles
// @access public
router.get('/pages/:page?', blogController.get_published_blogs);

// @route POST /blog
// @desc post a new blog article
// @access public
router.post('/', blogController.post_new_blog);

// @route GET /blog/:slug
// @desc return a specific blog article
// @access public
// router.get('/:slug', blogController.get_blog_at_slug);
router.get('/:slug', blogController.get_blog_at_slug);

// @route PUT /blog/:slug
// @desc update a specific blog article
// @access public
router.put('/:slug', blogController.update_blog_at_slug);

// @route PUT /blog/:slug/like
// @desc increments the number of likes of a blog article
// @access public
router.put('/:slug/like', blogController.like_blog_article);

// @route PUT /blog/:slug/publish
// @desc publish a specific blog article
// @access public
router.put('/:slug/publish', blogController.publish_blog_at_slug);

// @route PUT /blog/:slug/unpublish
// @desc unpublish a specific blog article
// @access public
router.put('/:slug/unpublish', blogController.unpublish_blog_at_slug);

// @route DELETE /blog/:slug
// @desc delete a specific blog article
// @access public
router.delete('/:slug', blogController.delete_blog_at_slug);

module.exports = router;
