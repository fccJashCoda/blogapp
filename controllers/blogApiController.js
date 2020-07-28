const helper = require('../utils/tools');

const { Blog } = require('../models/models');

// @route GET /blog/all
// @desc return all articles
// @access public
exports.get_all_blogs = (req, res) => {
  Blog.find()
    .then((blogs) => res.json({ blogs }))
    .catch((err) => res.json({ err }));
};

// @route GET /blog/pages/:page?
// @desc return last n published articles
// @access public
exports.get_published_blogs = (req, res, next) => {
  const perPage = 5;
  const page = req.params.page || 1;

  Blog.find({ published: true })
    .sort({ publishedDate: -1 })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .then((blogs) => {
      Blog.countDocuments({ published: true }).exec((err, count) => {
        if (err) return next(err);
        return res.json({
          blogs,
          current: page,
          pages: Math.ceil(count / perPage),
          blogCount: count,
        });
      });
    })
    .catch((err) => res.json({ err }));
};

// @route GET /blog/topFive
// @desc return 5 most read articles
// @access public
exports.get_top_five_blogs = (req, res, next) => {
  Blog.find({ published: true })
    .sort({ nOfReads: -1 })
    .limit(5)
    .then((topFive) => {
      return res.json({ topFive });
    })
    .catch((err) => res.json({ error: 'Invalid query' }));
};

// @route POST /blog
// @desc post a new blog article
// @access public
exports.post_new_blog = (req, res) => {
  const { author, title, article, snippet } = req.body;

  if (!author || !title || !article) {
    return res.json({ msg: 'Please fill all the fields before posting.' });
  }

  const slug = helper.slugify(title);

  Blog.findOne({ slug })
    .then((blog) => {
      if (blog) {
        return res.json({
          error: 'Slug already in use. Please modify the title.',
        });
      }

      const newBlog = new Blog({
        author,
        title,
        article,
        snippet,
      });

      newBlog
        .save()
        .then((blog) => res.json(blog))
        .catch((err) => res.status(500).json({ error: 'Server Error' }));
    })
    .catch((err) => {
      // use fs to save the error in file ||
      // build a bug tracker and send an api post to said tracker
      res.status(500).json({ error: 'Server Error' });
    });
};

// @route GET /blog/:slug
// @desc return a specific blog article
// @access public
exports.get_blog_at_slug = (req, res) => {
  Blog.findOne({ slug: req.params.slug })
    .then((blog) => {
      if (!blog) return res.json({ error: 'Article not found' });
      blog.incrementReads();
      return res.json({ blog });
    })
    .catch((err) => console.log(err));
};

// @route PUT /blog/:slug
// @desc update a specific blog article
// @access public
exports.update_blog_at_slug = (req, res) => {
  const { title, snippet, article } = req.body;
  const newSlug = helper.slugify(title);

  const promises = [
    Blog.findOne({ slug: req.params.slug }),
    Blog.findOne({ slug: newSlug }),
  ];
  Promise.all(promises)
    .then((results) => {
      const [foundSlug, foundNewSlug] = results;

      if (foundNewSlug && String(foundNewSlug._id) !== String(foundSlug._id)) {
        return res.json({ msg: 'Slug already used. Please modify the title.' });
      }

      Blog.findOneAndUpdate(
        { slug: req.params.slug },
        { title, snippet, article, slug: newSlug },
        (err, update) => {
          if (err) return res.status(500).json({ err });
          if (!update) return res.status(400).json({ msg: 'Blog not found' });
          return res.json({ msg: 'Update successful' });
        }
      );
    })
    .catch((err) => res.status(500).json({ error: 'Server Error' }));
};

// @route PUT /blog/:slug/like
// @desc increments the number of likes of a blog article
// @access public
exports.like_blog_article = (req, res) => {
  console.log(`${req.params.slug} liked`);
  Blog.findOne({ slug: req.params.slug }).then((blog) => {
    blog.like();
    return res.json({ msg: 'post liked' });
  });
};

// @route PUT /blog/:slug/publish
// @desc publish a specific blog article
// @access public
exports.publish_blog_at_slug = (req, res) => {
  Blog.findOne({ slug: req.params.slug })
    .then((blog) => {
      if (!blog) return res.json({ msg: 'Blog not found' });
      blog.publish(() => {
        return res.json({ msg: 'Blog published' });
      });
    })
    .catch((err) => res.status(500).json({ err }));
};

// @route PUT /blog/:id/unpublish
// @desc unpublish a specific blog article
// @access public
exports.unpublish_blog_at_slug = (req, res) => {
  Blog.findOne({ slug: req.params.slug })
    .then((blog) => {
      if (!blog) return res.json({ msg: 'Blog not found' });
      blog.unpublish(() => {
        return res.json({ msg: 'Blog unpublished' });
      });
    })
    .catch((err) => res.json({ err }));
};

// @route DELETE /blog/:id
// @desc delete a specific blog article
// @access public
exports.delete_blog_at_slug = (req, res) => {
  Blog.findOneAndDelete({ slug: req.params.slug }, (err, deleted) => {
    if (err) return res.status(500).json({ err });
    if (!deleted) return res.status(400).json({ err: 'Blog not found' });
    return res.json({ msg: `Deleted: ${req.params.slug}` });
  });
};
