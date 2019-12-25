const mongoose = require('mongoose');

const Album = require('./Album');
const Artist = require('./Artist');
const Playlist = require('./Playlist');
const Review = require('./Review');

const { Schema } = mongoose;

const List = new Schema({
  ids: [
    {
      type: String,
      required: true,
    },
  ],
  model: String,
});

const availableTypes = {
  albums: Album,
  artists: Artist,
  playlists: Playlist,
  reviews: Review,
};

List.methods.addItem = function({ type, id }) {};

module.exports = mongoose.model('lists', List);
