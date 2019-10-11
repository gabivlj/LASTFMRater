const mongoose = require('mongoose');

const Image = require('./Image');

const { Schema } = mongoose;

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
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
});

module.exports = mongoose.model('artists', ArtistSchema);
