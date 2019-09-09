import React from 'react';
import CommentComponent from '../CommentSection/Common/CommentComponent';

export default function CommentRender({ comment }) {
  console.log(comment._id);
  return (
    <div>
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
