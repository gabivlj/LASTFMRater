const User = require('../models/User');

module.exports = async users => {
  try {
    const user = await User.find({
      $or: users.map(user => ({ _id: user }))
    });
    return user;
  } catch (err) {
    console.log(err);
    return err;
  }
};
