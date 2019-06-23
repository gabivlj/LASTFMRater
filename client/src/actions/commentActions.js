import CommentSection from '../classes/CommentSection';
import axios from 'axios';
import handleError from '../utils/handleError';

export const addComment = (type, user, id, text, userId) => dispatch => {
	CommentSection.addComment(dispatch, type, id, user || null, text, userId);
};

export const actionToComment = (
	id,
	typeofOpinion,
	type,
	commentId,
	fastIndex,
	userId
) => dispatch => {
	CommentSection.opinionComment(
		dispatch,
		typeofOpinion,
		type,
		id,
		commentId,
		fastIndex,
		userId
	);
};

export const comment = (
	username,
	text,
	commentId,
	objectId
) => async dispatch => {
	if (!username || text == '' || !!commentId || !!objectId) {
		return;
	}
	const [res, error] = await handleError(
		axios.post(`/api/comment/${objectId}`),
		{ username, text, commentId }
	);
	if (error) {
		// todo: dispatch
		return;
	}
	return dispatch({
		type: 'COMMENT_ADD',
		payload: res.data.comment
	});
};

export const getComments = (objectId, limit = 50) => async dispatch => {
	const [res, error] = await handleError(
		axios.get(`/api/comment/${objectId}`, { params: { limit } })
	);
	if (error) {
		// todo: dispatch error
		return;
	}

	return dispatch({
		type: 'SET_COMMENTS',
		payload: res.data.comments
	});
};
