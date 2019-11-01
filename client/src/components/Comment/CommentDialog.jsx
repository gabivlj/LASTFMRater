import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import {
  commentOverlay,
  getComments,
  setLoading,
  cleanComments,
  goBackCommentOverlay,
} from '../../actions/commentActions';
import DialogMe from '../Chat/Chat/Dialog/Dialog';
import CommentRender from './CommentRender';
import useComments from '../../hooks/useComments';

function CommentDialog({
  commentOverlay,
  comments,
  setLoading,
  auth,
  getComments,
  cleanComments,
  goBackCommentOverlay,
}) {
  const { showCommentOverlay, comment } = comments;
  const [checkBottom] = useComments(
    setLoading,
    getComments,
    comments,
    auth,
    2000,
    50,
  );

  return (
    <div>
      <DialogMe
        open={showCommentOverlay}
        handleClose={() => {
          commentOverlay(false);
        }}
        Render={CommentRender}
        isLoading={false}
        title="Comment"
        titleButton="Testing"
        propsRender={{ comment, showCommentOverlay }}
        renderActions={<Button onClick={goBackCommentOverlay}>Back</Button>}
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
  {
    commentOverlay,
    setLoading,
    getComments,
    cleanComments,
    goBackCommentOverlay,
  },
)(CommentDialog);
