const mongoose = require('mongoose');

const { Schema } = mongoose;

const message = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  username: String,
  text: String,
  date: { type: Date, default: Date.now() },
};

const lastPerson = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  notification: Number,
};

const ChatSchema = new Schema({
  // Dictionary. // { "id_string": { username: --, id: --, images: [??], notification false }}
  users: Object,
  messages: [message],
  lastTalked: { type: Date, default: Date.now() },
  lastPerson,
});

module.exports = mongoose.model('chats', ChatSchema);
