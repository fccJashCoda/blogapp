const User = require('../models/user');

exports.get_user_profile = (req, res) => {
  res.render('userprofile');
};

exports.get_user_account = async (req, res) => {
  try {
    const getUser = await User.findOne({ username: req.params.username });
    if (String(res.locals.user.id) !== String(getUser._id)) {
      return res.render('404', { status: '403', msg: ' - Access Denied' });
    }
    return res.render('useraccount');
  } catch (error) {
    return res.render('404', { status: '500', msg: 'Server error' });
  }
};

exports.post_user_account = (req, res) => {
  res.json({ msg: 'settings updated' });
};
