import React from 'react'
import { connect } from 'react-redux';
import { addComment, actionToComment } from '../../actions/commentActions';
import PropTypes from 'prop-types';
import CommentSection from './CommentSection';

function CommentShowcase({ auth, comments, objectId, addComment, actionToComment, type, ...props }) {
  return (
    <div>
      <CommentSection 
        user={auth.user}
        comments={comments}
        objectId={objectId}
        addComment={(user, objectId, text) => addComment(type, user, objectId, text)}
        addLike={(objectId, commentId, fastIndex) => actionToComment(objectId, 'like', type, commentId, fastIndex)}
        addDislike={(objectId, commentId, fastIndex) => actionToComment(objectId, 'dislike', type, commentId, fastIndex)}
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

CommentShowcase.propTypes = {
  auth: PropTypes.object.isRequired,
  addComment: PropTypes.func.isRequired,
  actionToComment: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { addComment, actionToComment })(CommentShowcase);