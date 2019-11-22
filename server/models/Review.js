const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReviewsSchema = new Schema({
  objectID: { type: String, required: true },
  // Morelike html
  username: String,
  userID: {
    ref: 'users',
    type: Schema.Types.ObjectId,
  },
  modelType: {
    type: String,
    default: 'albums',
  },
  text: String,
  show: {
    type: Boolean,
    default: false,
  },
  likes: [
    {
      ref: 'users',
      type: Schema.Types.ObjectId,
    },
  ],
  dislikes: [
    {
      ref: 'users',
      type: Schema.Types.ObjectId,
    },
  ],
});

const Reviews = mongoose.model('reviews', ReviewsSchema);

module.exports = Reviews;
