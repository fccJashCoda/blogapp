const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogCommentSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    blogPost: {
      type: String,
      // type: Schema.Types.ObjectId,
      // ref: 'Blog',
    },
    test: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const BlogComment = mongoose.model('BlogCommemt', blogCommentSchema);
module.exports = BlogComment;
