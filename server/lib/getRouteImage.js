const User = require('../models/User');

module.exports = async id => {
  try {
    const user = await User.findById(id);
    let image = null;
    if (user.images.length >= 0) {
      [image] = user.images;
    }
    return image;
  } catch (err) {
    console.log(err);
    return err;
  }
};
