/**
 * @NOTE_ I THINK WE ARE NOT GONNA USE THIS, BUT I JUST LET IT EXIST JUST IN CASE,
 * I THINK WE ARE GONNA LET THE COMMENT SECTION MANAGER API TO ANOTHER LANGUAGE LIKE
 * RUST, GO, OR PYTHON. ( I think go is the go-to language to this task )
 */
const express = require('express');
const router = express.Router();
const CommentSection = require('../models/CommentSection');
const mapLikesDislikes = require('../classes/Album').mapLikesDislikes;
const CommentSchema = require('../classes/CommentSchema');
const passport = require('passport');

/**
 * @GET
 * @param comment section id
 * @param
 */
router.get('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const commentSection = await CommentSection.findById({ _id: id });
		if (!commentSection) {
			return res.status(404).json({ error: 'Comment section not found.' });
		}
		commentSection.comments = Array.from(commentSection.comments);
		commentSection.comments = mapLikesDislikes(commentSection.comments);
		res.json({ comments: commentSection.comments });
	} catch (err) {
		return res.status(404).json({ error: 'Comment section not found.' });
	}
});

router.post(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const { text, username } = req.body;
		const { id } = req.params;
		const [error, comments] = await handleError(CommentSection.findById(id));
		if (error || !comments) {
			return res.status(404).json({ error: 'Comment section not found.' });
		}
		const comment = new CommentSchema(req.user.id, username, text);
		const [errorReturn, returner] = await handleError(
			Comment.postComment(comments, comment)
		);

		if (errorReturn) {
			return res.status(500).json({ error: 'Error with the server.' });
		}

		res.json({ comments: returner });
	}
);

module.exports = router;
