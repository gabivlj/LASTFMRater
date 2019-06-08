export default (comments) => comments.map(comment => ({
  ...comment,
  likes: comment.likes ? comment.likes.length : 0,
  dislikes: comment.dislikes ? comment.dislikes.length : 0,
}));