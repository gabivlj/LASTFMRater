/**
 * @NOTE_ I THINK WE ARE NOT GONNA USE THIS, BUT I JUST LET IT EXIST JUST IN CASE,
 * I THINK WE ARE GONNA LET THE COMMENT SECTION MANAGER API TO ANOTHER LANGUAGE LIKE
 * RUST, GO, OR PYTHON. ( I think go is the go-to language to this task )
 *
 * @@@@ UPDATE: Ok so I think we are definitely using this.
 */
const express = require('express');
const router = express.Router();
const CommentLib = require('../classes/Comment');
const passport = require('passport');
const Comment = require('../models/Comment');

router.get('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		let commentSection = await Comment.find({ objectId: id }).sort({
			date: -1
		});
		if (!commentSection) {
			return res.status(404).json({ error: 'Comment section not found.' });
		}
		const comments = [];
		for (let comment of commentSection) {
			const commentP = {
				text: comment.text,
				username: comment.username,
				user: comment.user,
				__v: comment.__v,
				likes: parseInt(comment.likes.length, 10),
				dislikes: parseInt(comment.dislikes.length, 10),
				objectId: comment.objectId
			};
			comments.push(commentP);
		}
		res.json({ comments });
	} catch (err) {
		return res
			.status(404)
			.json({ error: 'Comment section not found.', log: err });
	}
});

router.post(
	'/:objectId',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { text, username, userId = req.user.id } = req.body;
		const { objectId } = req.params;
		const comment = new Comment({
			text,
			username,
			objectId,
			likes: [],
			dislikes: [],
			user: userId
		});
		comment.save();
		return res.json({ comment });
	}
);

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
		console.log(comment);
		const returnedComment = CommentLib.addOpinionToSingleComment(
			comment,
			id,
			'likes',
			'dislikes'
		);
		const finalComment = {
			text: returnedComment.text,
			username: returnedComment.username,
			user: returnedComment.user,
			__v: returnedComment.__v,
			likes: parseInt(returnedComment.likes.length, 10),
			dislikes: parseInt(returnedComment.dislikes.length, 10),
			objectId: returnedComment.objectId
		};
		returnedComment.save();
		res.json({ comment: finalComment });
	}
);

router.post(
	'/dislike/:comment_id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { comment_id } = req.params;
		const { id } = req.user;
		const comment = Comment.findById(comment_id);
		if (!comment) {
			return res.status(404).json({ error: 'Comment not found ' });
		}
		const returnedComment = CommentLib.addOpinionToSingleComment(
			comment,
			id,
			'dislikes',
			'likes'
		);
		const finalComment = {
			text: returnedComment.text,
			username: returnedComment.username,
			user: returnedComment.user,
			__v: returnedComment.__v,
			likes: parseInt(returnedComment.likes.length, 10),
			dislikes: parseInt(returnedComment.dislikes.length, 10),
			objectId: returnedComment.objectId
		};
		res.json({ comment: finalComment });
	}
);

// /**
//  * @GET
//  * @param comment section id
//  * @param
//  */
// router.get('/:id', async (req, res) => {
// 	const { id } = req.params;
// 	try {
// 		const commentSection = await CommentSection.findById({ _id: id });
// 		if (!commentSection) {
// 			return res.status(404).json({ error: 'Comment section not found.' });
// 		}
// 		commentSection.comments = Array.from(commentSection.comments);
// 		commentSection.comments = mapLikesDislikes(commentSection.comments);
// 		res.json({ comments: commentSection.comments });
// 	} catch (err) {
// 		return res.status(404).json({ error: 'Comment section not found.' });
// 	}
// });

// router.post(
// 	'/:id',
// 	passport.authenticate('jwt', { session: false }),
// 	async (req, res) => {
// 		const { text, username } = req.body;
// 		const { id } = req.params;
// 		const [error, comments] = await handleError(CommentSection.findById(id));
// 		if (error || !comments) {
// 			return res.status(404).json({ error: 'Comment section not found.' });
// 		}
// 		const comment = new CommentSchema(req.user.id, username, text);
// 		const [errorReturn, returner] = await handleError(
// 			Comment.postComment(comments, comment)
// 		);

// 		if (errorReturn) {
// 			return res.status(500).json({ error: 'Error with the server.' });
// 		}

// 		res.json({ comments: returner });
// 	}
// );

module.exports = router;
