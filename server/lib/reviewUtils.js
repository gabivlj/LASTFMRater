const mongoose = require('mongoose');
const Review = require('../models/Review');
const mongoQueries = require('./mongoQueries');

const { ObjectId } = mongoose.Types;

function getReviewType(reviewType) {
  if (String(reviewType) === 'ALBUM') {
    return 'albums';
  }
  return null;
}

const functions = {
  mapAllReviewsToPuntuations(reviews, album, addModelInformation = false) {
    // No album no party.
    if (!album) {
      return reviews;
    }
    // Zip puntuations so we can access them easier.
    const mappedPuntuations = album.ratings.reduce((prev, now) => {
      prev[now.user] = now.puntuation || -1;
      return prev;
    }, {});
    // Loop through the reviews so we can add to the album object the concrete information we need and to the puntuation attribute the puntuation we need.
    for (const review of reviews) {
      review.puntuation = mappedPuntuations[review.username] || 0;
      if (addModelInformation) {
        review.album = {
          name: album.name,
          artist: album.artist,
          mbid: album.mbid,
          _id: album._id,
        };
      }
      delete review.albums;
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
      reviews[0][type] ? reviews[0][type][0] : null,
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
      }),
    ).limit(endingIndex + 1);
    if (!reviews || reviews.length === 0) {
      return [];
    }
    const arrayReturnReviews = functions.mapAllReviewsToPuntuations(
      reviews.slice(startingIndex, endingIndex + 1),
      reviews[0][type] ? reviews[0][type][0] : null,
      // Tell the function that we want album's, or other thing, information
      true,
    );
    return arrayReturnReviews;
  },
};

module.exports = functions;
