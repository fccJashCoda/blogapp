const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogCommentSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    commentBody: {
      type: String,
      required: true,
    },
    blogId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BlogComment = mongoose.model('BlogComment', blogCommentSchema);
module.exports = BlogComment;
