/**
 * @description In the comment section he have: comments of comment section and comments of the overlay that shows the response of a comment.
 *              Thats why are booleans of isOverlay etc. in JSX CommentSection components, because each have diff. behaviours
 *              and should load depending of what is happening in each piece
 */

import CommentSection from '../classes/CommentSection';
import handleError from '../utils/handleError';
import { notifyError, notifySuccess } from './notifyActions';
import SocketInstance from '../classes/SocketInstance';
import { axiosAPI } from '../utils/axios';

export const addComment = (type, user, id, text, userId) => dispatch => {
  CommentSection.addComment(dispatch, type, id, user || null, text, userId);
};

export const showCommentOverlay = (open = true) => ({
  type: 'SHOW_OVERLAY',
  payload: open,
});

export const setCommentOverlay = ({
  _id,
  text,
  image,
  username,
}) => async dispatch => {
  dispatch(showCommentOverlay(true));
  // set the comment
  return dispatch({
    type: 'SET_COMMENT_OVERLAY',
    payload: { _id, text, image, username },
  });
};

export const commentOverlay = open => dispatch => {
  if (!open) {
    dispatch({
      type: 'CLOSE_OVERLAY',
    });
  }
  dispatch(showCommentOverlay(open));
};

/**
 * @description Slices the end comment on the list of comments when navigating through comments on the overlay
 */
export const goBackCommentOverlay = () => (dispatch, store) =>
  store().comments.comment.length > 1
    ? dispatch({ type: 'GO_BACK_COMMENT' })
    : dispatch({ type: 'CLOSE_OVERLAY' });

export const actionToComment = (
  id,
  typeofOpinion,
  type,
  commentId,
  fastIndex,
  userId,
) => dispatch => {
  CommentSection.opinionComment(
    dispatch,
    typeofOpinion,
    type,
    id,
    commentId,
    fastIndex,
    userId,
  );
};

export const comment = (
  username,
  text,
  objectId,
  pathname,
  name,
  answer = false,
) => async (dispatch, store) => {
  console.log(name);
  if (!username || text === '' || !objectId || !pathname || !name) {
    return null;
  }
  const [res, error] = await handleError(
    axiosAPI.post(`/comments/${objectId}`, {
      username,
      text,
      pathname,
      name,
      answered: answer,
    }),
  );
  if (error) {
    dispatch(notifyError('Error adding comment.', 3000));
    return dispatch({
      type: 'ERROR_COMMENTING',
    });
  }

  dispatch(notifySuccess('Comment succesfuly added!', 3000));
  dispatch({
    type: 'ADD_COMMENT',
    payload: res.data.comment,
  });
  const { socket } = SocketInstance;
  if (socket) {
    socket.informOfGramps(store().auth.apiUser.followers);
  }
  return true;
};

export const getComments = (
  objectId,
  current = 0,
  limit = 50,
  userId = null,
) => async dispatch => {
  const [res, error] = await handleError(
    axiosAPI.get(`/comments/${objectId}`, {
      params: { current, limit, userId },
    }),
  );
  if (error) {
    // todo: dispatch error
    return dispatch({
      type: 'ERROR_GETTING_COMMENTS',
    });
  }
  return dispatch({
    type: 'SET_COMMENTS',
    payload: res.data.comments,
  });
};

export const setLoading = () => dispatch => {
  return dispatch({
    type: 'SET_LOADING_COMMENTS',
  });
};

export const setComments = comments => dispatch => {
  return dispatch({
    type: 'SET_COMMENTS',
    payload: comments,
  });
};

/**
 * @param {String} type, 'like' or 'dislike'
 * @param {String} commentId
 */
export const addOpinionToComment = (
  type,
  commentId,
  index,
) => async dispatch => {
  if (type !== 'like' && type !== 'dislike') {
    console.error(
      `Please, pass a valid parameter in type, you passed: ${type}, and it should be like or dislike`,
    );
    return dispatch({
      type: 'ERROR_LIKING',
    });
  }
  const [res, error] = await handleError(
    axiosAPI.post(`/comments/${type}/${commentId}`),
  );
  if (error) {
    return dispatch({
      type: 'ERROR_LIKING_DISLIKING',
    });
  }

  return dispatch({
    type: 'REPLACE_COMMENT',
    payload: {
      comment: res.data.comment,
      index,
    },
  });
};

export const cleanComments = () => dispatch => {
  dispatch(setComments([]));
};
