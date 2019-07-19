const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  lastfm: {
    type: String
  },
  img: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  ratedAlbums: [
    {
      type: Schema.Types.ObjectId,
      ref: 'album'
    }
  ],
  reviews: [{ type: String, required: true }],
  followedAccounts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  ],
  followers: [
    {
      ref: 'users',
      type: Schema.Types.ObjectId,
      required: true
    }
  ],
  playlists: [
    {
      playlistid: {
        type: Schema.Types.ObjectId,
        ref: 'playlists',
        required: true
      },
      name: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('users', UserSchema);
