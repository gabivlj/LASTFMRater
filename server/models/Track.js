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
  ratings: [
    {
      powerLevel: {
        type: Number,
        default: 1,
      },
      puntuation: {
        type: Number,
        required: true,
      },
      user: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('tracks', TrackSchema);
