import React from 'react'
import PropTypes from 'prop-types';
import Comment from './Comment';

function CommentSection({ user, addComment, comments, likeComment, dislikeComment }) {
  function onLike(id) {
    return () => {
      likeComment(id, user ? user._id : null);
    }
  }

  function onDislike(id) {
    return () => {
      likeComment(id, user ? user._id : null);
    }
  }

  const commentsRender = comments.map(comment => 
      <Comment
        key={comment._id}
        user={comment.username}
        text={comment.text}
        likes={comment.likes - comment.dislikes}
        loged={user}
        like={onLike(comment._id)}
        dislike={onDislike(comment._id)}
        img={comment.img}
      /> 
    )
  return (
    <div>
      <h1>Comments</h1>
      {commentsRender}
    </div>
  )
}

CommentSection.propTypes = {
  user: PropTypes.object,
  addComment: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  dislikeComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
}

CommentSection.defaultProps = {
  user: null,
}

export default CommentSection;