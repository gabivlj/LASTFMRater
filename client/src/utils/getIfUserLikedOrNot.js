export default (comments, userId) => {
  const commentsMod = comments.map(comment => {
    const likes = comment.likes.map(like => String(like.user));
    const dislikes = comment.dislikes.map(dislike => String(dislike.user));
    if (likes.indexOf(String(userId)) > -1) {
      comment.liked = true;
    }
    if (dislikes.indexOf(String(userId)) > -1) {
      comment.disliked = true;
    }
    return comment;
  });
  return commentsMod;
}