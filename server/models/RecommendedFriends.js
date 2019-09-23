const mongoose = require('mongoose');

const { Schema } = mongoose;

const RecommendedFriends = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  recommended: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
});

module.exports = mongoose.model('recommended_friends', RecommendedFriends);
