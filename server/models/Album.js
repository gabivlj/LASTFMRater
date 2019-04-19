const mongoose = require('mongoose')
;
const {Schema} = mongoose;

const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  tracks: [
    {
      trackId: {
        ref: 'tracks',
        type: Schema.Types.ObjectId,
      },
    },
  ],
  mbid: {
    type: String,
  },
  ratings: [
    {
      puntuation: {
        type: Number,
        required: true,
      },
      user: {
        type: String,
        required: true,
      },
    },
  ],
  reviews: [
    {
      text: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        isRequired: true,
      },
      title: {
        type: String,
        isRequired: true,
      },
      puntuation: {
        type: Number,
      },
    },
  ],
  comments: [
    {
      text: { type: String },
      userName: { type: String, required: true },
      user: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
      likes: [
        { user: { type: Schema.Types.ObjectId, required: true, ref: 'users' } },
      ],
      Date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

module.exports = User = mongoose.model('albums', AlbumSchema);
