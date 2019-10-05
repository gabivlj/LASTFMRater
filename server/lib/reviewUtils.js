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
    if (!album) {
      return reviews;
    }
    const mappedPuntuations = album.ratings.reduce((prev, now) => {
      prev[now.user] = now.puntuation || -1;
      return prev;
    }, {});
    for (const review of reviews) {
      review.puntuation = mappedPuntuations[review.username] || -1;
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
    const reviews = await Review.aggregate(
      mongoQueries.aggregations.reviews.getReviews(objectID, type),
    ).limit(endingIndex + 1);

    if (!reviews || reviews.length === 0) {
      return [];
    }

    const arrayReturnReviews = functions.mapAllReviewsToPuntuations(
      reviews.slice(startingIndex, endingIndex + 1),
      reviews[0][type] ? reviews[0][type][0] : null,
    );
    return arrayReturnReviews;
  },

  async getReviewsUserID(
    userID,
    startingIndex,
    endingIndex,
    reviewType = 'ALBUM',
  ) {
    const type = getReviewType(reviewType);
    const reviews = await Review.aggregate(
      mongoQueries.aggregations.reviews.getReviews(null, type, {
        userID: ObjectId(userID),
        show: true,
      }),
    ).limit(endingIndex + 1);
    if (!reviews || reviews.length === 0) {
      return [];
    }
    const arrayReturnReviews = functions.mapAllReviewsToPuntuations(
      reviews.slice(startingIndex, endingIndex + 1),
      reviews[0][type] ? reviews[0][type][0] : null,
      true,
    );
    return arrayReturnReviews;
  },
};

module.exports = functions;
