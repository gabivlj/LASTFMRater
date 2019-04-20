const mongoose = require('mongoose');

const { Schema } = mongoose;

const TrackSchema = new Schema({
  duration: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    default: 'None',
  },
});

module.exports = Track = mongoose.model('tracks', TrackSchema);
