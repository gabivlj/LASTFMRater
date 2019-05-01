const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * @PLAYLISTMODEL only tracks are here.
 */
const PlaylistModel = new Schema({
  user: {
    type: String,
    required: true,
  },
  tracksShow: [{}],
  tracks: [
    {
      trackId: {
        ref: 'tracks',
        type: Schema.Types.ObjectId,
      },
    },
  ],
  ratings: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'users' },
      puntuation: { type: Number },
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
  playlistName: {
    type: String,
    default: '',
  },
  playlistDescription: {
    type: String,
    default: '',
  },
  playlistCover: {
    type: String,
    default: '',
  },
});

module.exports = Playlist = mongoose.model('playlists', PlaylistModel);
