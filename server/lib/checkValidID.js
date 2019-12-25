const mongoose = require('mongoose');

const handleError = require('./handleError');
const Album = require('../models/Album');
const Artist = require('../models/Artist');
const Playlist = require('../models/Playlist');
const Review = require('../models/Review');

/**
 * @param {mongoose.Types.ObjectId} objectID
 * @param {String} documentType albums: Album,
                                artists: Artist,
                                playlists: Playlist,
                                reviews: Review,
 * @description Tries to search in a given document type if the item exists
 * @returns {Boolean} True if it's a valid ID, false otherwise.
 */
const checkValidID = async (objectID, documentType) => {
  const availableTypes = {
    albums: Album,
    artists: Artist,
    playlists: Playlist,
    reviews: Review,
  };
  if (!(documentType in availableTypes)) {
    return false;
  }

  const [err, item] = await handleError(
    availableTypes[documentType].findById(objectID),
  );

  return !err && !!item;
};

module.export = checkValidID;
