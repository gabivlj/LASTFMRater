const express = require('express');
const passport = require('passport');
const Review = require('../models/Review');

const router = express.Router();

// TODO: We will need to use aggregation for getting reviews because we want the image profiles...

router.get('/reviews/object/:objectID', async (req, res) => {
  const { objectID } = req.params;
  const reviews = await Review.find({ objectID, show: true });
  if (!reviews || reviews.length === 0) {
    return res.json({ reviews: [] });
  }
  return res.json({ reviews });
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
    const review = await Review.findById(reviewID);
    if (!review) {
      return res.status(404).json({ error: 'Error finding review.' });
    }
    return res.json({ review });
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
      let review = await Review.findById(_id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found.' });
      }
      review = {
        text: text || review.text,
        show: show === null ? review.show : show,
        objectID: objectID || review.objectID,
        userID: id || review.userID,
        username: username || review.username,
      };
      const updated = await review.save();
      return res.json({ review: updated });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ err: 'Error updating review.' });
    }
  },
);

module.exports = router;
