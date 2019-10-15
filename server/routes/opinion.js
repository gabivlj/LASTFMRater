const passport = require('passport');
const router = require('express').Router();
const Opinion = require('../models/Opinions');
const handleError = require('../lib/handleError');
const commentHelper = require('../classes/Comment').addOpinionToSingleComment;

/**
 * @description Returns number of likes and dislikes of an object and say if the user liked it or disliked it.
 * @query {String? || ObjectID?} userID
 */
router.get('/:id', async (req, res) => {
  const [err, opinion] = await handleError(Opinion.findById(req.params.id));
  if (err) {
    return res.status(400).json({ error: 'Error finding opinion.' });
  }
  if (!opinion) {
    return res.status(404).json({
      error: 'Opinion not found.',
      opinion: { likes: 0, dislikes: 0, liked: false, disliked: false },
    });
  }

  let liked = false;
  let disliked = false;
  const { userID = null } = req.query;
  const userIDIsNotNull =
    userID &&
    typeof userID === 'string' &&
    userID !== 'null' &&
    userID !== 'undefined';

  if (userIDIsNotNull) {
    for (
      let i = 0, j = 0;
      i < opinion.likes.length && j < opinion.dislikes.length;
      i += 1, j += 1
    ) {
      if (
        i < opinion.likes.length &&
        String(userID) === String(opinion.likes[i])
      ) {
        liked = true;
        break;
      }
      if (
        j < opinion.dislikes.length &&
        String(userID) === String(opinion.dislikes[i])
      ) {
        disliked = true;
        break;
      }
    }
  }

  return res.json({
    opinion: {
      likes: opinion.likes.length,
      dislikes: opinion.dislikes.length,
      disliked,
      liked,
    },
  });
});

router.post(
  '/opinion/:id/:type',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { type = '', id } = req.params;
    const { user } = req;
    if (type !== 'like' && type !== 'dislike') {
      return res.status(400).json({ error: 'Unknown action.' });
    }
    const [error, opinion] = await handleError(Opinion.findById(id));
    if (error) {
      return res.status(400).json({ error: 'Error finding opinion.' });
    }
    if (!opinion) {
      const newOpinion = new Opinion({
        objectID: id,
        likes: type === 'like' ? [{ user: user._id }] : [],
        dislikes: [type === 'dislike' ? [{ user: user._id }] : []],
      });
      const [err, opinionSaved] = await handleError(newOpinion.save());
      if (err) return res.status(404).json({ error: 'Error saving opinon.' });
      return res.json({ opinion: opinionSaved });
    }
    // todo: Add or remove like/dislike from array of opinions.
  },
);

module.exports = router;
