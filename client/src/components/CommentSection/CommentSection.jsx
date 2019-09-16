import React from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';
import CommentForm from './CommentForm';
import linksHttp from '../../utils/links.http';

function CommentSection({
  user,
  addComment,
  comments,
  likeComment,
  dislikeComment,
  objectId,
}) {
  function onLike(commentId, fastIndex) {
    return () => {
      likeComment(objectId, commentId, fastIndex);
    };
  }

  function onDislike(commentId, fastIndex) {
    return () => {
      dislikeComment(objectId, commentId, fastIndex);
    };
  }

  function onSubmit(txt) {
    if (typeof user === 'string' && user.length > 3) {
      addComment(user, objectId, txt);
    }
  }

  const commentsRender = comments
    ? comments.map((comment, index) => (
        <Comment
        key={comment._id}
        user={comment.username}
        text={comment.text}
        likes={comment.likes - comment.dislikes}
        loged={user}
        like={onLike(comment._id, index)}
        dislike={onDislike(comment._id, index)}
        img={
            comment.images && comment.images[0]
              ? `${linksHttp.GO_IMAGE}/api/image/${
                  comment.images[0].md.split('.')[0]
                }`
              : null
          }
        liked={comment.liked}
        disliked={comment.disliked}
      />
      ))
    : null;
  return (
    <div>
      <h1>Comments</h1>
      <CommentForm onSubmit={onSubmit} />
      {commentsRender}
    </div>
  );
}

CommentSection.propTypes = {
  user: PropTypes.string,
  addComment: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  dislikeComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
  // Object related id.
  objectId: PropTypes.string.isRequired,
};

CommentSection.defaultProps = {
  user: null,
};

export default CommentSection;
