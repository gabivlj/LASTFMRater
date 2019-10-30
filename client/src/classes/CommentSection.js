import mapLikesDislikes from '../utils/mapLikesDislikes';
import handleError from '../utils/handleError';
import getIfUserLikedOrNot from '../utils/getIfUserLikedOrNot';
import { axiosAPI } from '../utils/axios';

const getStringsForActions = type => {
  return {
    addDispatch: `ADD_COMMENT_${type.toUpperCase()}`,
    errorDispatch: `ERROR_ADDING_COMMENT_${type.toUpperCase()}`,
    queryAddingComment: id => `/${type.toLowerCase()}/comment/${id}`,
    queryAddingOpinion: (id, opinion, commentId) =>
      `/${type}/comment/${opinion}/${id}/${commentId}`,
  };
};

/**
 * Handles comment section actions for redux.
 * @deprecated in the future, it saddens me a bit but we must deprecate this :/, too much overengineering and back end is slow with this version.
 */
class CommentSection {
  /**
   *
   * @param {Function} dispatch
   * @param {String} element, element type
   * @param {String} elementId, Id
   * @param {String} username, username
   * @param {String} text, comment
   */
  static async addComment(
    dispatch,
    element,
    elementId,
    username,
    text,
    userId,
  ) {
    const actions = getStringsForActions(element);

    if (
      typeof username !== 'string' ||
      username.length === 0 ||
      typeof text !== 'string' ||
      text.length < 1
    ) {
      return dispatch({
        type: actions.errorDispatch,
      });
    }

    const [response, error] = await handleError(
      axiosAPI.post(actions.queryAddingComment(elementId), { username, text }),
    );

    if (error) {
      return dispatch({
        type: actions.errorDispatch,
      });
    }

    const { data } = response;
    let comments = getIfUserLikedOrNot(data.comments, userId);
    comments = mapLikesDislikes(comments);

    dispatch({
      type: actions.addDispatch,
      payload: { comments },
    });
  }

  static async opinionComment(
    dispatch,
    typeofOpinion,
    element,
    elementId,
    commentId,
    fastIndex,
    userId,
  ) {
    const actions = getStringsForActions(element);

    const [response, error] = await handleError(
      axiosAPI.post(
        actions.queryAddingOpinion(elementId, typeofOpinion, commentId),
        { fastIndex },
      ),
    );
    if (error) {
      console.log(error);
      return dispatch({
        type: 'ERROR_LIKING_COMMENT',
      });
    }
    const { data } = response;
    // Now mapLikesDislikes the comments.
    let comments = getIfUserLikedOrNot(data.comments, userId);
    comments = mapLikesDislikes(comments);
    dispatch({
      // Maybe generalize this ??
      type: actions.addDispatch,
      payload: {
        comments,
      },
    });
  }
}

export default CommentSection;
