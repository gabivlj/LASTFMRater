const express = require('express');
const passport = require('passport');
const Review = require('../models/Review');
const mongoQueries = require('../lib/mongoQueries');
const reviewUtils = require('../lib/reviewUtils');

const router = express.Router();

function getReviewType(reviewType) {
  if (String(reviewType) === 'ALBUM') {
    return 'albums';
  }
  return null;
}

router.get('/reviews/object/:objectID', async (req, res) => {
  const { objectID } = req.params;
  const { reviewType = '', profile = 'NO' } = req.query;
  const startingIndex = parseInt(req.query.startingIndex, 10) || 0;
  const endingIndex = parseInt(req.query.endingIndex, 10) || 10;
  const functionForReviews =
    profile === 'NO'
      ? reviewUtils.getReviewsObjectID
      : reviewUtils.getReviewsUserID;
  const arrayReturnReviews = await functionForReviews(
    objectID,
    startingIndex,
    endingIndex,
    reviewType,
  );
  return res.json({ reviews: arrayReturnReviews });
});

router.get('/reviews/user/:userID', async (req, res) => {
  const { userID } = req.params;
  const reviews = await Review.find({ userID, show: true });
  if (!reviews || reviews.length === 0) {
    return res.json({ reviews: [] });
  }
  return res.json({ reviews });
});

router.get('/reviews/review/:reviewID', async (req, res) => {
  try {
    const { reviewID } = req.params;
    const { reviewType } = req.query;
    const type = getReviewType(reviewType);
    const review = await Review.aggregate(
      mongoQueries.aggregations.reviews.getReview(reviewID, type),
    );
    if (!review || review.length === 0) {
      return res.status(404).json({ error: 'Error finding review.' });
    }
    // Returns an array so we choose the first element.
    const reviewObject = review[0];
    const { username } = reviewObject;
    // The review object is also an array.
    const objectType = reviewObject[type] ? reviewObject[type][0] : null;
    // Extract the puntuation. (It's -1 if it does not exist...)
    const puntuation = reviewUtils.getPuntuationFromObject(
      username,
      objectType,
    );
    reviewObject.puntuation = puntuation;
    delete reviewObject.albums;
    return res.json({ review: reviewObject });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Error with the request' });
  }
});

router.get(
  '/reviews/me',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id } = req.user;
    const reviews = await Review.find({ userID: id });
    if (!reviews || reviews.length === 0) {
      return res.json({ reviews: [] });
    }
    return res.json({ reviews });
  },
);

router.get(
  '/reviews/review/me/:reviewID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { reviewID } = req.params;
      const review = await Review.findOne({
        _id: reviewID,
        userID: req.user.id,
      });
      if (!review) {
        return res.status(404).json({ error: 'Error finding review.' });
      }
      return res.json({ review });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: 'Error with the request' });
    }
  },
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { id, username } = req.user;
      const { text, show = false, objectID } = req.body;
      const review = new Review({
        text,
        objectID,
        username,
        userID: id,
        show,
        likes: [],
        dislikes: [],
      });
      const saved = await review.save();
      return res.json({ review: saved });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ err: 'Error posting review.' });
    }
  },
);

/**
 * @description Updates a Review (pass what you wanna update on the body)
 */
router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { id, username } = req.user;
      const { text = null, show = null, objectID = null, _id } = req.body;
      if (!_id) {
        return res.status(400).json({ badRequest: 'Pass a good id.' });
      }
      const review = await Review.findById(_id);
      if (String(review.userID) !== String(id))
        return res
          .status(400)
          .json({ error: 'Review doesnt belong to that user' });
      if (!review) {
        return res.status(404).json({ error: 'Review not found.' });
      }
      const reviewChanges = {
        text: text || review.text,
        show: show === null ? review.show : show,
        objectID: objectID || review.objectID,
        username: username || review.username,
      };
      review.text = reviewChanges.text;
      review.show = reviewChanges.show;
      review.objectID = reviewChanges.objectID;
      const updated = await review.save();
      return res.json({ review: updated });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ err: 'Error updating review.' });
    }
  },
);

module.exports = router;
