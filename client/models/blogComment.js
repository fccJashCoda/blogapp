const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogCommentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    blogPostId: {
      type: String,
      required: true,
    },
    test: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const BlogComment = mongoose.model('BlogComment', blogCommentSchema);
module.exports = BlogComment;
