const passport = require('passport');
const router = require('express').Router();
const Opinion = require('../models/Opinions');
const handleError = require('../lib/handleError');
const zip = require('../lib/zip');
const { addOpinionToSingleComment } = require('../classes/Comment');

/**
 * @description Returns number of likes and dislikes of an object and say if the user liked it or disliked it.
 * @query {String? || ObjectID?} userID
 */
router.get('/:id', async (req, res) => {
  const [err, opinion] = await handleError(
    Opinion.findOne({ objectID: req.params.id }),
  );
  if (err) {
    return res.status(400).json({ error: 'Error finding opinion.' });
  }
  if (!opinion) {
    return res.status(404).json({
      error: 'Opinion not found. Create one and use .opinion as placeholder.',
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
    if (type !== 'likes' && type !== 'dislikes') {
      return res.status(400).json({ error: 'Unknown action.' });
    }
    const [error, opinion] = await handleError(
      Opinion.findOne({ objectID: id }),
    );
    if (error) {
      return res.status(400).json({ error: 'Error finding opinion.' });
    }
    console.log(opinion);
    if (!opinion) {
      const newOpinion = new Opinion({
        objectID: id,
        likes: type === 'likes' ? [{ user: user._id }] : [],
        dislikes: type === 'dislikes' ? [{ user: user._id }] : [],
      });
      const [err, opinionSaved] = await handleError(newOpinion.save());
      if (err) return res.status(404).json({ error: 'Error saving opinon.' });
      return res.json({
        opinion: {
          likes: newOpinion.likes.length,
          dislikes: newOpinion.dislikes.length,
          liked: !!newOpinion.likes.length,
          disliked: !!newOpinion.dislikes.length,
        },
      });
    }

    // todo: Add or remove like/dislike from array of opinions.
    const opinionReturn = addOpinionToSingleComment(
      opinion,
      user.id,
      type,
      type === 'likes' ? 'dislikes' : 'likes',
    );
    const liked = !!zip(opinionReturn.likes, k => String(k.user))[
      String(user._id)
    ];
    const disliked = !!zip(opinionReturn.dislikes, k => String(k.user))[
      String(user._id)
    ];
    await opinionReturn.save();
    return res.json({
      opinion: {
        likes: opinionReturn.likes.length,
        dislikes: opinionReturn.dislikes.length,
        liked,
        disliked,
      },
    });
  },
);

module.exports = router;
