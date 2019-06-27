import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	comment,
	addOpinionToComment,
	getComments,
	setLoading,
	setComments
} from '../../../actions/commentActions';
import CommentSection from '../CommentSection';

/**
 * @description Component that you only have to pass the objectId and it will handle the rest for your comment section. It's very
 * useful because we won't need to refactor the children of this Component. Also we will delete the Comment Library that it was made
 * before for handling the comment sections.
 */
function CommentComponent({
	objectId,
	auth,
	comments,
	comment,
	addOpinionToComment,
	getComments,
	setLoading,
	setComments
}) {
	// Variable declarations
	const numberOfCommentsAdd = 50;
	// Redux refactoring.
	const userId = auth.apiUser ? auth.apiUser.id : null;
	const userName = auth.apiUser ? auth.apiUser.user : null;
	const { loaded } = comments;

	// Before useEffect function declarations
	function checkBottom() {
		// Private local variable of the function.
		let timeoutForLoading = false;
		let currentNumberOfComments = 0;
		return () => {
			// When scrolling to the bottom of the component, reload comments.
			if (
				window.innerHeight + window.scrollY >= document.body.offsetHeight &&
				loaded && !timeoutForLoading
			) {
				setLoading();
				// Adding to the local variable.
				currentNumberOfComments += numberOfCommentsAdd;
				// API Call.
				getComments(objectId, currentNumberOfComments, userId);
				// Tell the browser not to load again in 3s.
				timeoutForLoading = true;
				setTimeout(() =>  timeoutForLoading = false, 3000);
			}
		}
	}

	// UseEffect
	useEffect(() => {
		// todo: Check for other scroll actions.
		document.addEventListener('wheel', checkBottom());
		// Remove the EventListener
		return () => {
			document.removeEventListener('wheel', checkBottom());
			setComments([]);
		};
	}, []);

	// After UseEffect function declarations
	/**
	 * @description passed fn. to CommentSection (Check component for more information).
	 */
	function like(_, commentId, fastIndex) {
		addOpinionToComment('like', commentId, fastIndex);
	}
	/**
	 * @description passed fn. to CommentSection (Check component for more information).
	 */
	function dislike(_, commentId, fastIndex) {
		addOpinionToComment('dislike', commentId, fastIndex);
	}
	/**
	 * @description passed fn. to CommentSection (Check component for more information).
	 */
	function commentSubmit(user, _, txt) {
		console.log(objectId);
		comment(user,  txt, objectId);
	}

	return (
		<CommentSection
			addComment={commentSubmit}
			likeComment={like}
			dislikeComment={dislike}
			objectId={objectId}
			comments={comments.comments}
			user={userName}
		/>
	);
}

const mapStateToProps = state => ({
	auth: state.auth,
	comments: state.comments
});

CommentComponent.propTypes = {
	objectId: PropTypes.string.isRequired,
	auth: PropTypes.object.isRequired,
	comment: PropTypes.func.isRequired,
	addOpinionToComment: PropTypes.func.isRequired,
	getComments: PropTypes.func.isRequired,
	setLoading: PropTypes.func.isRequired,
	setComments: PropTypes.func.isRequired,
	comments: PropTypes.array
};

CommentComponent.defaultProps = {
	comments: []
};

export default connect(
	mapStateToProps,
	{
		comment,
		addOpinionToComment,
		getComments,
		setLoading,
		setComments
	}
)(CommentComponent);
