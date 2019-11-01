/**
 * @@@@ UPDATE: Ok so I think we are definitely using this.
 */
const express = require('express');
const passport = require('passport');

const router = express.Router();

// const time = require('../lib/time');
const CommentLib = require('../classes/Comment');

const Comment = require('../models/Comment');
const Activity = require('../classes/Activity');
const mongoQuery = require('../lib/mongoQueries');

/**
 * @GET
 * @PUBLIC
 * @DESCRIPTION Returns all the comments sorted by date
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { current = 0, limit = 50, userId } = req.query;
  const parsedLimit = parseInt(limit, 10) || 20;
  console.log(parsedLimit);
  try {
    // const commentSection = await Comment.find({ objectId: id })
    //   .sort({
    //     date: -1,
    //   })
    //   .limit(parsedLimit);
    const commentSection = await Comment.aggregate(
      mongoQuery.aggregations.commentSection.getComments(id),
    )
      .sort({
        date: -1,
      })
      .limit(parsedLimit);
    if (!commentSection) {
      return res.status(404).json({ error: 'Comment section not found.' });
    }
    const comments = commentSection.reduce((prev, comment) => {
      const commentP = {
        text: comment.text,
        username: comment.username,
        user: comment.user,
        objectId: comment.objectId,
        images: comment.userImages.images || [],
        __v: comment.__v,
        date: comment.date,
        likes: parseInt(comment.likes.length, 10),
        dislikes: parseInt(comment.dislikes.length, 10),
        _id: comment._id,
      };
      const copy = CommentLib.setHasLikedOrDislikedProperty(comment, userId);
      commentP.liked = copy.liked;
      commentP.disliked = copy.disliked;
      return [...prev, commentP];
    }, []);

    res.json({ comments });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ error: 'Comment section not found.', log: err });
  }
});

/**
 * @POST
 * @PRIVATE
 * @DESCRIPTION Posts a comment to the comment database. (This is the good one)
 */
router.post(
  '/:objectId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const {
      text,
      username,
      userId = req.user.id,
      pathname,
      name,
      answered = false,
    } = req.body;
    const { objectId } = req.params;
    const comment = new Comment({
      text,
      username,
      objectId,
      likes: [],
      dislikes: [],
      user: userId,
      date: Date.now(),
    });
    const commentSaved = await comment.save();
    Activity.addSomethingActivity(
      Activity.createCommentedInformation(
        { username, _id: userId },
        text,
        {
          // TODO ATTENTION: Maybe add param: comment_id?
          commentId: commentSaved._id,
          objId: objectId,
          pathname,
          name,
        },
        answered,
      ),
    );
    return res.json({ comment });
  },
);

router.get(
  '/get/:commentID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id } = req.user;
    const { commentID } = req.params;
    const comment = await Comment.findById(commentID);
    if (!comment) {
      return res.status(404).json({ error: 'Comment does not exist.' });
    }
    const liked =
      comment.likes.filter(like => String(like.user) === String(id)).length >=
      1;
    let disliked = !liked;
    if (!liked)
      disliked =
        comment.dislikes.filter(like => String(like.user) === String(id))
          .length >= 1;

    const likes = comment.likes.length;
    const dislikes = comment.dislikes.length;
    return res.json({
      likes,
      dislikes,
      liked,
      disliked,
      objectId: comment.objectId,
      text: comment.text,
      username: comment.username,
      user: comment.user,
      date: comment.date,
    });
  },
);

/**
 * @POST
 * @PRIVATE
 * @DESCRIPTION Posts a like to the specified id comment.
 */
router.post(
  '/like/:comment_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { comment_id } = req.params;
    const { id } = req.user;
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found ' });
    }
    const returnedComment = CommentLib.addOpinionToSingleComment(
      comment,
      id,
      'likes',
      'dislikes',
    );
    const finalComment = {
      text: returnedComment.text,
      username: returnedComment.username,
      user: returnedComment.user,
      __v: returnedComment.__v,
      likes: parseInt(returnedComment.likes.length, 10),
      dislikes: parseInt(returnedComment.dislikes.length, 10),
      _id: returnedComment._id,
    };
    const copy = CommentLib.setHasLikedOrDislikedProperty(returnedComment, id);
    finalComment.liked = copy.liked;
    finalComment.disliked = copy.disliked;
    returnedComment.save();
    res.json({ comment: finalComment });
  },
);

/**
 * @POST
 * @PRIVATE
 * @DESCRIPTION Posts a dislike to the specified id comment.
 */
router.post(
  '/dislike/:comment_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { comment_id } = req.params;
    const { id } = req.user;
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found ' });
    }
    const returnedComment = CommentLib.addOpinionToSingleComment(
      comment,
      id,
      'dislikes',
      'likes',
    );
    const finalComment = {
      text: returnedComment.text,
      username: returnedComment.username,
      user: returnedComment.user,
      __v: returnedComment.__v,
      likes: parseInt(returnedComment.likes.length, 10),
      dislikes: parseInt(returnedComment.dislikes.length, 10),
      _id: returnedComment._id,
    };

    const copy = CommentLib.setHasLikedOrDislikedProperty(returnedComment, id);
    finalComment.liked = copy.liked;
    finalComment.disliked = copy.disliked;
    returnedComment.save();
    res.json({ comment: finalComment });
  },
);

router.get('/comment/:id', async (req, res) => {});

module.exports = router;
