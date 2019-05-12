const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProfileSchema = new Schema({
  img: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

const Profile = mongoose.model('profile', ProfileSchema);

module.exports = Profile;
