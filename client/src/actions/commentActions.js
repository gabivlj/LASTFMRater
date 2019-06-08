import CommentSection from "../classes/CommentSection";

export const addComment = dispatch => (type, user, id, text) => {
  CommentSection.addComment(dispatch, type, id, user ? user.username : null, text);
}

export const actionToComment = dispatch => (id, typeofOpinion, type, id, commentId, fastIndex) => {
  CommentSection.opinionComment(dispatch, typeofOpinion, type, id, commentId, fastIndex);
}
