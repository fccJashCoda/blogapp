const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

const { checkIsAuthenticated } = require("../auth/utils");

router.get("/", (req, res) => {
  res.redirect("/blog/");
});

// @route GET /blog/:page?
// @desc redirects to the main blog page
// @access public
router.get("/blog/:page?", blogController.get_blogs);

// @route TEST ROUTES
// @desc
// @access public
// router.post('/test/:slug', blogController.post_commentv2);
router.get("/test/:slug", blogController.get_blog);

// @route POST /:slug/like
// @desc allows liking a blog if user is authenticated
// @access private
router.post("/:slug/like", checkIsAuthenticated, blogController.put_slug_like);

// @route GET /:slug/comment
// @desc display the comment page
// @access private
router.get(
  "/:slug/comment",
  checkIsAuthenticated,
  blogController.get_slug_comment
);

// @route POST /:slug/comment
// @desc post a comment if user is authenticated
// @access private
router.post(
  "/:slug/comment",
  checkIsAuthenticated,
  blogController.post_slug_comment
);

// @route POST /:slug
// @desc display a specific article
// @access public
router.get("/:slug", blogController.get_blog);

module.exports = router;
