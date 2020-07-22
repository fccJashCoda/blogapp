const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helper = require('../utils/tools');

const blogSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    snippet: {
      type: String,
    },
    article: {
      type: String,
      required: true,
    },
    nOfReads: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedDate: {
      type: String,
    },
  },
  { timestamps: true }
);

blogSchema.pre('save', function (next) {
  this.slug = helper.slugify(this.title);
  next();
});

blogSchema.methods.incrementReads = function () {
  this.nOfReads++;
  this.save();
};

blogSchema.methods.like = function () {
  this.likes++;
  this.save();
};

blogSchema.methods.publish = function (cb) {
  this.published = true;
  this.publishedDate = Date.now();
  this.save(() => cb());
};

blogSchema.methods.unpublish = function (cb) {
  this.published = false;
  this.save(() => cb());
};

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
