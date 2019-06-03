import React from 'react'
import PropTypes from 'prop-types';
import Comment from './Comment';
import CommentForm from './CommentForm';

function CommentSection({ user, addComment, comments, likeComment, dislikeComment, objectId }) {
  function onLike(commentId, fastIndex) {
    return () => {
      likeComment(objectId, commentId, fastIndex);
    }
  }

  function onDislike(commentId, fastIndex) {
    return () => {
      dislikeComment(objectId, commentId, fastIndex);
    }
  }

  function onSubmit(txt) {
    console.log(user);
    if (user && typeof user === 'object') { 
      addComment(user.user, objectId, txt);
    }
  }

  const commentsRender = comments.map((comment, index) => 
      <Comment
        key={comment._id}
        user={comment.username}
        text={comment.text}
        likes={comment.likes - comment.dislikes}
        loged={user}
        like={onLike(comment._id, index)}
        dislike={onDislike(comment._id, index)}
        img={comment.img}
      /> 
    )
  return (
    <div>
      <h1>Comments</h1>
      <CommentForm 
        onSubmit={onSubmit}
      />
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
  // Object related id.
  objectId: PropTypes.string.isRequired
}

CommentSection.defaultProps = {
  user: null,
}

export default CommentSection;