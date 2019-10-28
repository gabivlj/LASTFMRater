import React from 'react';
import { LinearProgress } from '@material-ui/core';
import Comment from '../CommentSection/Comment';
import useLikesDislikes from '../../hooks/useLikesDislikes';

function CommentSingleRender({ comment }) {
  const [
    likes,
    liked,
    dislikes,
    disliked,
    like,
    dislike,
    // If refused connection show: Not loged! Log in again etc.
    refusedConnection,
  ] = useLikesDislikes(comment._id);
  return (
    <div>
      {comment ? (
        <Comment
          img={comment.img}
          user={comment.username}
          loged="."
          text={comment.text}
          like={like}
          likes={likes - dislikes}
          liked={liked}
          disliked={disliked}
          dislike={dislike}
          _id={comment._id}
        />
      ) : (
        <LinearProgress />
      )}
    </div>
  );
}

export default CommentSingleRender;
