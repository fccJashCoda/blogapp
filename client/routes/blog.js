const express = require('express');
const router = express.Router();
const { blogController } = require('../controllers/controllers');

const { checkIsAuthenticated } = require('../auth/utils');

router.get('/test', checkIsAuthenticated, (req, res) => {
  res.send('test page');
});

router.get('/:page?', blogController.get_blogs);

module.exports = router;
