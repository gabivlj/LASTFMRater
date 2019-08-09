const mongoose = require('mongoose');

const { Schema } = mongoose;

const message = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  text: String,
  date: { type: Date, default: Date.now() }
};

const ChatSchema = new Schema({
  // Dictionary. // { "id_string": { username: --, id: --, images: [??]}}
  users: Object,
  messages: [message]
});

module.exports = mongoose.model('chats', ChatSchema);
