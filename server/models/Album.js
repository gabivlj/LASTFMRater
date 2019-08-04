const mongoose = require('mongoose');
const Image = require('./Image');

const { Schema } = mongoose;
const CommentSchema = new Schema({
  text: { type: String, required: true },
  username: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  likes: [{ user: { type: Schema.Types.ObjectId, ref: 'users' } }],
  dislikes: [{ user: { type: Schema.Types.ObjectId, ref: 'users' } }],
  date: {
    type: Date,
    default: Date.now()
  }
});

const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  images: [Image],
  tracks: [
    {
      trackId: {
        ref: 'tracks',
        type: Schema.Types.ObjectId
      }
    }
  ],
  mbid: {
    type: String
  },
  ratings: [
    {
      puntuation: {
        type: Number,
        required: true
      },
      user: {
        type: String,
        required: true
      }
    }
  ],
  reviews: [
    {
      text: {
        type: String,
        required: true
      },
      author: {
        type: String,
        isRequired: true
      },
      title: {
        type: String,
        isRequired: true
      },
      puntuation: {
        type: Number
      }
    }
  ],
  comments: [CommentSchema]
});

module.exports = mongoose.model('albums', AlbumSchema);
