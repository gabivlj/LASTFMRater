import CommentSection from "../classes/CommentSection";

export const addComment = (type, user, id, text, userId) => dispatch =>  {
  CommentSection.addComment(dispatch, type, id, user || null, text, userId);
}

export const actionToComment = (id, typeofOpinion, type, commentId, fastIndex, userId) => dispatch => {
  CommentSection.opinionComment(dispatch, typeofOpinion, type, id, commentId, fastIndex, userId);
}
