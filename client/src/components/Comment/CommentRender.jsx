import React from 'react';
import CommentComponent from '../CommentSection/Common/CommentComponent';
import CommentSingleRender from './CommentSingleRender';

export default function CommentRender({ comment, showCommentOverlay }) {
  const commentItem = comment.length && comment[comment.length - 1];
  console.log(commentItem);
  return (
    <div>
      {showCommentOverlay && commentItem && (
        <div>
          <CommentSingleRender comment={commentItem} />
          <br />
          <CommentComponent
            isOverlay
            key="1"
            useOwnOnScroll
            objectId={commentItem._id}
            name={commentItem.username}
            paddingIfNotLoaded
            answer
          />
        </div>
      )}
    </div>
  );
}
