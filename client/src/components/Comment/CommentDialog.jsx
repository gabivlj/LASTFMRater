import React from 'react';
import { connect } from 'react-redux';
import { commentOverlay } from '../../actions/commentActions';
import DialogMe from '../Chat/Chat/Dialog/Dialog';
import CommentComponent from '../CommentSection/Common/CommentComponent';
import CommentRender from './CommentRender';

function CommentDialog({ commentOverlay, comments }) {
  const { showCommentOverlay, comment, loaded } = comments;

  return (
    <div>
      <DialogMe
        open={showCommentOverlay}
        handleClose={() => commentOverlay(false)}
        Render={CommentRender}
        isLoading={!loaded}
        title="Comment"
        titleButton="Testing"
        propsRender={{ comment }}
        renderActions="a"
        scrollableGeneral={false}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  comments: state.comments,
});

export default connect(
  mapStateToProps,
  { commentOverlay },
)(CommentDialog);
