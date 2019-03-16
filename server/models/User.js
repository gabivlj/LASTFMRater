const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  ratedAlbums: [
    {
      type: Schema.Types.ObjectId,
      ref: 'album'
    }
  ],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'album' }]
})

module.exports = User = mongoose.model('users', UserSchema)
