const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/:page?', blogController.get_blogs);

// router.get('/:slug', blogController.get_blog);

module.exports = router;
