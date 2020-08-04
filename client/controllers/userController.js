const User = require('../models/user');

// @route GET /:username
// @desc display a users profile
// @access public
exports.get_user_profile = (req, res) => {
  res.render('userprofile');
};

// @route GET /account/:username
// @desc display a users account
// @access private
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

// @route POST /account/:username
// @desc save the changes to a users acocunt
// @access private
// NOT YET IMPLEMENTED
exports.post_user_account = (req, res) => {
  res.json({ msg: 'settings updated' });
};
