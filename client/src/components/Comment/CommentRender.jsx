import React from 'react';
import CommentComponent from '../CommentSection/Common/CommentComponent';

export default function CommentRender({ comment }) {
  return (
    <div>
      <CommentComponent
        objectId={comment._id}
        name={comment.username}
        paddingIfNotLoaded
      />
    </div>
  );
}
