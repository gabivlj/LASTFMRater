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
  // SET IN THE CLIENT
  score: Number,
  userScore: Number,
  // ...
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
      powerLevel: { type: Number },
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
  moods: [String],
  genres: [String],
});

module.exports = mongoose.model('playlists', PlaylistModel);
