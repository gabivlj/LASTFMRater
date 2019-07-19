const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReviewsSchema = new Schema({
  objectId: { type: String, required: true },
  // Morelike html
  reviews: [
    {
      html: { type: String, required: true },
      userId: { type: Schema.Types.ObjectId, ref: 'users' },
      userName: { type: String, required: true }
    }
  ]
});

const Reviews = mongoose.model('reviews', ReviewsSchema);

module.exports = Reviews;
