const mongoose = require('mongoose');

const { Schema } = mongoose;

const Image = require('./Image');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  lastfm: {
    type: String,
  },
  images: [Image],
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  ratedAlbums: [
    {
      type: Schema.Types.ObjectId,
      ref: 'album',
    },
  ],
  reviews: [{ type: String, required: true }],
  followedAccounts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
  followersObject: Object,
  followedObject: Object,
  followers: [
    {
      ref: 'users',
      type: Schema.Types.ObjectId,
    },
  ],
  playlists: [
    {
      playlistid: {
        type: Schema.Types.ObjectId,
        ref: 'playlists',
        required: true,
      },
      name: { type: String, required: true },
    },
  ],
  description: String,
  likedAlbums: {},
});

module.exports = mongoose.model('users', UserSchema);
