const handleError = require('../lib/handleError');
const Comment = require('./CommentSchema');
const albumHelper = require('./Album');

/**
 * @param {String}
 * @param {String}
 * @param {Object} CommentSchemaInstances
 * @description Basically, just remove (if it exists) from this array of opinions the opinion from the desired user
 */
function checkOtherOpinionArrayAndDelete(userId, otherType, comment) {
	if (Array.isArray(comment[otherType])) {
		const opinions = comment[otherType].filter(
			opinion => String(opinion.user) !== String(userId)
		);
		comment[otherType] = opinions;
	}
	return comment;
}

/**
 * @param {String} userId
 * @param {Comment} comment
 * @param {String} type
 * @returns {Commment} comment changed
 */
function addOpinionToSpecific(userId, comment, type) {
	let index = -1;
	if (Array.isArray(comment[type])) {
		index = comment[type]
			.map(opinions => String(opinions.user))
			.indexOf(String(userId));
	} else {
		comment[type] = [{ user: userId }];
		console.log(comment[type], comment);
		return comment;
	}

	if (index > -1) {
		// If it finds it delete.
		comment[type].splice(index, 1);
		return comment;
	}
	comment[type].push({ user: userId });
	return comment;
}

/**
 * @param {Array} comments, Comments array.
 * @param {String} id, Id to find
 * @param {Callback} fn, What do you wanna do to that comment.
 * @returns {[index, comment]} index and the comment changed.
 */
function findComment(comments, id, fn) {
	let index = 0;
	for (let comment of comments) {
		if (String(comment._id) === String(id)) {
			comment = fn(comment);
			return [index, comment];
		}
		index += 1;
	}
	return -1;
}

function areParamsRight(model, comment) {
	if (!model || !comment) return false;
	return true;
}

/**
 * @description Handles all the comment adding, deleting, and like related stuff.
 */
class CommentHandler {
	/**
	 * @param {SchemaInstance} model
	 * @param {Comment} comment
	 * @returns {Promise} comments
	 * @deprecated
	 */
	static postComment(modelInstance, comment) {
		return new Promise(async (resolve, reject) => {
			if (!areParamsRight(modelInstance, comment)) {
				return reject(new Error('Please pass all the params right'));
			}
			try {
				modelInstance.comments = [comment, ...modelInstance.comments];
				const returner = await modelInstance.save();
				// returner.comments = albumHelper.mapLikesDislikes(returner.comments);
				return resolve(returner.comments);
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
	 * @param {SchemaInstance} SchemaInstance
	 * @param {Array} comments
	 * @param {String} type, For the moment, likes or dislikes string shall be passed to this.
	 * @param {String} commentId
	 * @param {Number} fastIndex
	 * @param {StringId} userGivingOpinion
	 * @returns {Object} { whatTypeOfOpinionYouPassed: numberOfPeopleInThatOpinion }
	 * @deprecated
	 */
	static addOpinionToComment(
		SchemaInstance,
		type,
		commentId,
		fastIndex,
		userGivingOpinion,
		otherType = 'dislike'
	) {
		return new Promise(async (resolve, reject) => {
			let finalIndex = -1;
			// Check if we can do fast indexing.
			function checkFastIndex() {
				return (
					typeof fastIndex === 'number' &&
					SchemaInstance.comments.length > fastIndex &&
					fastIndex >= 0 &&
					String(SchemaInstance.comments[fastIndex]._id) === String(commentId)
				);
				// Do fastIndex
			}
			try {
				// Check fast index so we check there are no new comments when pushing like
				if (checkFastIndex()) {
					finalIndex = fastIndex;
					// if fast index worked, no need to worry, we addOpinionToSpecific directly.
					SchemaInstance.comments[fastIndex] = addOpinionToSpecific(
						userGivingOpinion,
						SchemaInstance.comments[fastIndex],
						type
					);
					SchemaInstance.comments[fastIndex] = checkOtherOpinionArrayAndDelete(
						userGivingOpinion,
						otherType,
						SchemaInstance.comments[fastIndex]
					);
				} else {
					// if fast index didn't work, just find the comment and addOpinionToSpecific.
					const [index, comment] = findComment(
						SchemaInstance.comments,
						commentId,
						_comment_ =>
							addOpinionToSpecific(userGivingOpinion, _comment_, type)
					);
					finalIndex = index;
					const finalComment = checkOtherOpinionArrayAndDelete(
						userGivingOpinion,
						otherType,
						SchemaInstance.comments[finalIndex]
					);
					SchemaInstance.comments[finalIndex] = finalComment;
				}
				const [error, instanceSaved] = await handleError(SchemaInstance.save());
				if (error) {
					return reject(error);
				}
				return resolve({
					[type]: SchemaInstance.comments[finalIndex][type].length,
					index: finalIndex,
					instanceSaved
				});
			} catch (err) {
				console.log(err);
				return reject(err);
			}
		});
	}

	/**
	 *
	 * @param {CommentSchema} comment
	 * @param {String} userId
	 * @param {String} type
	 * @param {String} otherType
	 * @returns {CommentSchema} commentModified
	 * @description Adds an opinion to the comment (A Like or a Dislike.)
	 */
	static addOpinionToSingleComment(comment, userId, type, otherType) {
		const index = comment[type]
			.map(op => String(op.user))
			.indexOf(String(userId));
		if (index > -1) {
			comment[type].splice(index, 1);
			return comment;
		}
		comment[type].push({ user: userId });
		return checkOtherOpinionArrayAndDelete(userId, otherType, comment);
	}

	static setHasLikedOrDislikedProperty(comment, userId) {
		if (userId === undefined || userId === null) return comment;
		const commentR = comment;
		commentR.liked =
			comment.likes.map(likes => String(likes.user)).indexOf(userId) > -1;
		commentR.disliked = false;
		if (commentR.liked) return commentR;
		commentR.disliked =
			comment.dislikes.map(likes => String(likes.user)).indexOf(userId) > -1;
		return commentR;
	}
}

module.exports = CommentHandler;
