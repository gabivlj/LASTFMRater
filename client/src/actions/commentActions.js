import CommentSection from "../classes/CommentSection";

export const addComment = dispatch => (type, user, id, text) => {
  CommentSection.addComment(dispatch, type, id, user || null, text);
}

export const actionToComment = dispatch => (id, typeofOpinion, type, commentId, fastIndex) => {
  CommentSection.opinionComment(dispatch, typeofOpinion, type, id, commentId, fastIndex);
}
