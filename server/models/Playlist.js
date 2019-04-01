const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * @PLAYLISTMODEL only tracks are here.
 */
const PlaylistModel = new Schema({
  tracks: [
    {
      // Maybe saving the album and artist names on the track are not a greeeeat idea but...
      name: {
        type: String,
        required: true
      },
      album: {
        type: String,
        required: true
      },
      artist: {
        type: String,
        required: true
      },
      duration: {
        type: String,
        required: true
      }
    }
  ],
  playlistRating: {
    type: Number,
    default: 0
  },
  playlistComments: [
    {
      text: { type: String },
      userName: { type: String, required: true },
      user: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
      likes: [
        { user: { type: Schema.Types.ObjectId, required: true, ref: 'users' } }
      ],
      Date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
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
})

module.exports = Playlist = mongoose.model('playlists', PlaylistModel)
