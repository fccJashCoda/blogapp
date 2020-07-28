const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordEncrypted: {
      type: Boolean,
      default: false,
    },
    likedPosts: {
      type: Array,
      default: [],
    },
    strikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  if (this.passwordEncrypted) {
    return next();
  }
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user.passwordEncrypted = true;
      next();
    });
  });
});

userSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compareSync(password, this.password);
  return compare;
};

userSchema.methods.addLikedPost = function (blog) {
  if (this.likedPosts.includes(blog)) {
    return next();
  }
  this.likedPosts.push(blog);
  this.save();
};

const User = mongoose.model('User', userSchema);
module.exports = User;
