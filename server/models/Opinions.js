const mongoose = require('mongoose');

const { Schema } = mongoose;
const OpinionSchema = new Schema({
  objectID: { type: String, required: true },
  likes: [{ user: { type: Schema.Types.ObjectId, ref: 'users' } }],
  dislikes: [{ user: { type: Schema.Types.ObjectId, ref: 'users' } }],
});

module.exports = mongoose.model('opinions', OpinionSchema);
