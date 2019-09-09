import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  commentOverlay,
  getComments,
  setLoading,
  cleanComments,
} from '../../actions/commentActions';
import DialogMe from '../Chat/Chat/Dialog/Dialog';
import CommentRender from './CommentRender';

function CommentDialog({
  commentOverlay,
  comments,
  setLoading,
  auth,
  getComments,
  cleanComments,
}) {
  const { showCommentOverlay, comment, loaded } = comments;
  const [, setCurrentNOfComments] = useState(0);
  let timeoutForLoading = false;
  const numberOfCommentsAdd = 10;
  function checkBottom(e) {
    // When scrolling to the bottom of the component, reload comments.
    console.log(
      e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight,
    );
    if (
      e.target.scrollTop >=
        e.target.scrollHeight - e.target.clientHeight - 10 &&
      loaded &&
      !timeoutForLoading
    ) {
      setLoading();
      // We do the update of the comments here because otherwise I don't know how we will get the prev value.
      setCurrentNOfComments(prev => {
        getComments(
          comment._id,
          0,
          prev + numberOfCommentsAdd,
          auth.apiUser ? auth.apiUser.id : null,
        );
        // Tell the browser not to load again in 3s.
        timeoutForLoading = true;
        setTimeout(() => {
          timeoutForLoading = false;
        }, 1000);
        // Update.
        return prev + numberOfCommentsAdd;
      });
      // API Call.
    }
  }

  return (
    <div>
      <DialogMe
        open={showCommentOverlay}
        handleClose={() => {
          commentOverlay(false);
          cleanComments();
        }}
        Render={CommentRender}
        isLoading={false}
        title="Comment"
        titleButton="Testing"
        propsRender={{ comment }}
        renderActions="a"
        scrollableGeneral={false}
        onScroll={checkBottom}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  comments: state.comments,
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { commentOverlay, setLoading, getComments, cleanComments },
)(CommentDialog);
