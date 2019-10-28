import React from 'react';
import CommentComponent from '../CommentSection/Common/CommentComponent';
import CommentSingleRender from './CommentSingleRender';

export default function CommentRender({ comment, showCommentOverlay }) {
  return (
    <div>
      {showCommentOverlay && (
        <div>
          <CommentSingleRender comment={comment} />
          <br />
          <CommentComponent
            isOverlay
            key="1"
            useOwnOnScroll
            objectId={comment._id}
            name={comment.username}
            paddingIfNotLoaded
            answer
          />
        </div>
      )}
    </div>
  );
}
