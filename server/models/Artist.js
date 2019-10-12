const mongoose = require('mongoose');

const Image = require('./Image');

const { Schema } = mongoose;

const ArtistSchema = new Schema({
  notProcessed: {
    type: Boolean,
    default: true,
  },
  grampyAccount: String,
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: Date,
  mbid: String,
  images: [Image],
  albums: [
    {
      ref: 'albums',
      type: Schema.Types.ObjectId,
    },
  ],
  description: {
    type: String,
  },
  genres: [
    {
      type: String,
    },
  ],
  networks: {
    twitter: String,
    spotify: String,
    itunes: String,
    facebook: String,
    instagram: String,
    youtube: String,
    soundcloud: String,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
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

module.exports = mongoose.model('artists', ArtistSchema);
