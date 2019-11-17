const mongoose = require('mongoose');
const Image = require('./Image');

const { Schema } = mongoose;

const AlbumSchema = new Schema({
  score: {
    type: Number,
    default: 0,
  },
  genres: [String],
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
    default: '0',
  },
  ratings: [
    {
      powerLevel: {
        type: Number,
        default: 1,
      },
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
  // EP, LP, SINGLE...
  typeAlbum: {
    type: String,
  },
});

module.exports = mongoose.model('albums', AlbumSchema);
