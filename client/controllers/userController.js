const User = require('../models/user');

// @route GET /:username
// @desc display a users profile
// @access public
exports.get_user_profile = async (req, res) => {
  try {
    const response = await User.findOne(
      { username: req.params.username },
      { password: 0 }
    );
    if (!response)
      return res.render('404', { status: '404', msg: ' - User Not Found' });
    return res.render('userprofile', { userprofile: response });
  } catch (error) {
    return res.render('404', { status: '500', msg: ' - Server Error' });
  }
};

// @route GET /account/:username
// @desc display a users account
// @access private
exports.get_user_account = async (req, res) => {
  try {
    const getUser = await User.findOne({ username: req.params.username });
    if (!getUser)
      return res.render('404', { status: '500', msg: ' - Server Error' });
    if (String(res.locals.user.id) !== String(getUser._id)) {
      return res.render('404', { status: '403', msg: ' - Access Denied' });
    }
    return res.render('useraccount', { account: getUser });
  } catch (error) {
    return res.render('404', { status: '500', msg: '- Server error' });
  }
};

// @route POST /account/:username
// @desc save the changes to a users acocunt
// @access private
// NOT YET IMPLEMENTED
exports.post_user_account = (req, res) => {
  res.json({ msg: 'settings updated' });
};
