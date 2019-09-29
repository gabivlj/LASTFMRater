import React from 'react';
import CommentComponent from '../CommentSection/Common/CommentComponent';
import CommentSingleRender from './CommentSingleRender';

export default function CommentRender({ comment }) {
  return (
    <div>
      <CommentSingleRender comment={comment} />
      <br />
      <CommentComponent
        useOwnOnScroll
        objectId={comment._id}
        name={comment.username}
        paddingIfNotLoaded
        answer
      />
    </div>
  );
}
