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
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.isValidPassword = async function (password) {
  console.log('comparing passwords');
  const compare = await bcrypt.compareSync(password, this.password);
  console.log(compare);
  return compare;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
