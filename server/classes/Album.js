const albumHelper = {
  mapLikesDislikes: comments =>
    comments.map(comment => ({
      ...comment,
      likes: comment.likes ? comment.likes.length : 0,
      dislikes: comment.dislikes ? comment.dislikes.length : 0,
    })),
  getIfUserLikedOrNot: (comments, userId) => {
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
  },
};

module.exports = albumHelper;
