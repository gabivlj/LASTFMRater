const mongoose = require('mongoose');

const { Schema } = mongoose;

const ActivitySchema = new Schema({
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId,
  },
  username: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  information: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('activity', ActivitySchema);
