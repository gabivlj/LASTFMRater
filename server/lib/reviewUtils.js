/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const Review = require('../models/Review');
const mongoQueries = require('./mongoQueries');

const { ObjectId } = mongoose.Types;

function getReviewType(reviewType) {
  if (String(reviewType) === 'ALBUM') {
    return 'albums';
  }
  if (String(reviewType) === 'TRACK') {
    return 'tracks';
  }
  return null;
}

const functions = {
  mapAllReviewsToPuntuations(
    reviews,
    type,
    addModelInformation = false,
    differentElements = false,
    // ownWayToGetModelInfo = index => album,
  ) {
    // No album no party.
    if (!type) {
      return reviews;
    }
    // Zip puntuations so we can access them easier.
    let mappedPuntuations;
    if (!differentElements)
      // Map the puntuations for more efficiency when we KNOW that all the reviews are of the same object.
      mappedPuntuations = reviews[0][type][0].ratings.reduce((prev, now) => {
        prev[now.user] = now.puntuation || -1;
        return prev;
      }, {});
    // Loop through the reviews so we can add to the album object the concrete information we need and to the puntuation attribute the puntuation we need.
    for (const review of reviews) {
      const element = review[type][0];
      if (mappedPuntuations) {
        review.puntuation = mappedPuntuations[review.username] || 0;
      } else {
        // sadly, the objects are different in each review so we cannot use mappedPunt.
        review.puntuation = (
          element.ratings.filter(
            r => String(r.user) === String(review.username),
          )[0] || { puntuation: 0 }
        ).puntuation;
      }
      if (addModelInformation) {
        review.album = {
          name: element.name,
          artist: element.artist,
          mbid: element.mbid,
          _id: element._id,
        };
      }
      delete review[type];
    }
    return reviews;
  },
  getPuntuationFromObject(username, reviewObject) {
    let puntuation = -1;
    if (reviewObject) {
      const ratingsFiltered = reviewObject.ratings.filter(
        rating => rating.user === username,
      );
      puntuation =
        ratingsFiltered.length > 0 ? ratingsFiltered[0].puntuation : -1;
    }
    return puntuation;
  },
  async getReviewsObjectID(objectID, startingIndex, endingIndex, reviewType) {
    const type = getReviewType(reviewType);
    // Add to the review object an attribute called albums (if review type is albums) and
    // the first object is the album object from the review.
    const reviews = await Review.aggregate(
      mongoQueries.aggregations.reviews.getReviews(objectID, type),
    ).limit(endingIndex + 1);

    if (!reviews || reviews.length === 0) {
      return [];
    }

    const arrayReturnReviews = functions.mapAllReviewsToPuntuations(
      reviews.slice(startingIndex, endingIndex + 1),
      // Pass the album (or other thing) object, if there is no album object pass null.
      // reviews[0][type] ? reviews[0][type][0] : null,
      type,
      false,
      false,
    );
    return arrayReturnReviews;
  },

  /**
   * @description returns the reviews from the specified user.
   * @param {*} userID
   * @param {*} startingIndex
   * @param {*} endingIndex
   * @param {*} reviewType
   * @param {*} show
   */
  async getReviewsUserID(
    userID,
    startingIndex,
    endingIndex,
    reviewType = 'ALBUM',
    show = true,
  ) {
    const type = getReviewType(reviewType);
    // Add to the review object an attribute called albums (if review type is albums) and
    // the first object is the album object from the review.
    const reviews = await Review.aggregate(
      mongoQueries.aggregations.reviews.getReviews(null, type, {
        userID: ObjectId(userID),
        show,
        modelType: type,
      }),
    ).limit(endingIndex + 1);
    if (!reviews || reviews.length === 0) {
      return [];
    }
    // reviews.forEach(r => console.log(r.albums[0].name));
    const arrayReturnReviews = functions.mapAllReviewsToPuntuations(
      reviews.slice(startingIndex, endingIndex + 1),
      // reviews[0][type] ? reviews[0][type][0] : null,
      type,
      // Tell the function that we want album's, or other thing, information
      true,
      true,
    );
    return arrayReturnReviews;
  },
};

module.exports = functions;
