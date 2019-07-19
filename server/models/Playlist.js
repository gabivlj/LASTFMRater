const mongoose = require('mongoose');

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

/**
 * @PLAYLISTMODEL only tracks are here.
 */
const PlaylistModel = new Schema({
  user: {
    type: String,
    required: true
  },
  tracksShow: [{}],
  tracks: [
    {
      trackId: {
        ref: 'tracks',
        type: Schema.Types.ObjectId
      }
    }
  ],
  ratings: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'users' },
      puntuation: { type: Number }
    }
  ],
  comments: [CommentSchema],
  playlistName: {
    type: String,
    default: ''
  },
  playlistDescription: {
    type: String,
    default: ''
  },
  playlistCover: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('playlists', PlaylistModel);
