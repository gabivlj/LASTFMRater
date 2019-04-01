const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  comments: [
    {
      text: {
        type: String
      },
      user: {
        type: Schema.Types.ObjectId,
        required: true
      },
      username: {
        type: String,
        required: true
      },
      Date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  albums: [
    {
      ref: 'albums',
      type: Schema.Types.ObjectId
    }
  ],
  description: {
    type: String
  },
  genres: [
    {
      type: String
    }
  ]
})

module.exports = ArtistSchema = mongoose.model('artists', ArtistSchema)
