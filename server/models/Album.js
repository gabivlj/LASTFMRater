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
    default: Date.now(),
  },
});

const AlbumSchema = new Schema({
  notProcessed: {
    type: Boolean,
    default: false,
  },
  userArtist: String,
  lastfmSource: Boolean,
  dateOfCreation: {
    year: Number,
    month: Number,
    day: Number,
    date: Date,
  },
  name: {
    type: String,
    required: true,
    text: true,
  },
  artistId: {
    type: Schema.Types.ObjectId,
    ref: 'artists',
  },
  artist: {
    type: String,
    required: true,
    text: true,
  },
  images: [Image],
  tracks: [
    {
      trackId: {
        ref: 'tracks',
        type: Schema.Types.ObjectId,
      },
      duration: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      features: [
        {
          artistId: String,
          artist: String,
        },
      ],
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
  numberOfReviewsEachDay: [
    {
      date: {
        type: Date,
        default: Date.now(),
      },
      sum: {
        type: Number,
        default: 0,
      },
    },
  ],
  usersLiked: {},
  pendingChanges: [
    {
      typeOfChange: {
        required: true,
        type: String,
      },
      data: Object,
    },
  ],
});

module.exports = mongoose.model('albums', AlbumSchema);
