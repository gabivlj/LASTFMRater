const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  tracks: [
    {
      name: {
        type: String,
        required: true
      },
      artist: {
        type: String,
        required: true
      },
      artistId: {
        type: Schema.Types.ObjectId,
        ref: 'artists'
      },
      duration: {
        type: Number // Seconds
      },
      trackId: {
        type: Schema.Types.ObjectId,
        ref: 'tracks'
      }
    }
  ],
  mbid: {
    type: String
  },
  ratings: [
    {
      puntuation: {
        type: Number,
        required: true
      },
      user: {
        type: String,
        required: true
      }
    }
  ],
  reviews: [
    {
      text: {
        type: String,
        required: true
      },
      author: {
        type: String,
        isRequired: true
      },
      title: {
        type: String,
        isRequired: true
      },
      puntuation: {
        type: Number
      }
    }
  ]
})

module.exports = User = mongoose.model('albums', AlbumSchema)
