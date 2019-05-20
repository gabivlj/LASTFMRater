const albumHelper = {
  mapLikesDislikes: comments =>
    comments.map(comment => ({
      ...comment,
      likes: comment.likes ? comment.likes.length : 0,
      dislikes: comment.dislikes ? comment.dislikes.length : 0,
    })),
};

module.exports = albumHelper;
