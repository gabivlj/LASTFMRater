import axios from 'axios';
import mapLikesDislikes from '../utils/mapLikesDislikes';
import handleError from '../utils/handleError';

// List of things that have comments. (INFO)
const ALBUM = 'ALBUM';
const PLAYLIST = 'PLAYLIST';
const ARTIST = 'ARTIST';
const PROFILE = 'PROFILE';

const getStringsForActions = (type) => {
  return {
    addDispatch: `ADD_COMMENT_${type.toUpperCase()}`,
    errorDispatch: `ERROR_ADDING_COMMENT_${type.toUpperCase()}`,
    queryAddingComment: (id) => `/${type.toLowerCase()}/comment/${id}`,
    queryAddingOpinion: (id, opinion, commentId) => `${type}/comment/${opinion}/${id}/${commentId}`,
  }
}

/**
 * Handles comment section actions for redux.
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
  static addComment(dispatch, element, elementId, username, text) {
    const actions = getStringsForActions(element);

    if (typeof username !== 'string' || username.length === 0 || typeof text !== 'string' || text.length < 1) {
      return dispatch({
        type: actions.errorDispatch,
      });
    }
    
    const [response, error] = await handleError(
      axios.post(actions.queryAddingComment(elementId), { username, text })
    );

    if (error) {
      return dispatch({
        type: actions.errorDispatch,
      });
    }

    const { data } = response;
    const comments = mapLikesDislikes(data.comments);

    dispatch({
      type: actions.addDispatch,
      payload: { comments },
    });

  }

  static opinionComment(dispatch, typeofOpinion, element, elementId, commentId, fastIndex) {
    const actions = getStringsForActions(element);

    const [response, error] = await handleError(
      axios.post(
        actions.queryAddingOpinion(
          elementId, typeofOpinion, commentId
        ), 
        { fastIndex }
      )
    );
    if (error) {
      dispatch({
        type: 'ERROR_LIKING_COMMENT'
      })
    }
    const { data } = response;
    // Now mapLikesDislikes the comments.
    const comments = mapLikesDislikes(data.comments);
    dispatch({
      // Maybe generalize this ?? 
      type: actions.addDispatch,
      payload: {
        comments
      }
    });
  }

}

export default CommentSection;
