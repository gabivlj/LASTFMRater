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
	const [currentNumberOfComments, setNumberOfComments] = useState(0);
	const numberOfCommentsAdd = 50;
	const userId = auth.apiUser ? auth.apiUser.id : null;
	const { loaded, comments } = comments;

	// Before useEffect function declarations
	function checkBottom() {
		if (
			window.innerHeight + window.scrollY >= document.body.offsetHeight &&
			loaded
		) {
			setNumberOfComments(currentNumberOfComments + numberOfCommentsAdd);
			setLoading();
			getComments(objectId, currentNumberOfComments, userId);
		}
	}

	// UseEffect
	useEffect(() => {
		document.addEventListener('wheel', checkBottom);
		return () => {
			document.removeEventListener('wheel', checkBottom);
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
		comment(user, objectId, txt);
	}

	return <div />;
}

const mapStateToProps = state => ({
	auth: state.auth,
	comments: state.comments
});

CommentComponent.propTypes = {
	objectId: PropTypes.string.isRequird,
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
