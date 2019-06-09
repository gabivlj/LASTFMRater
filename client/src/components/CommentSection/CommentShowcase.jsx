import React from 'react'
import { connect } from 'react-redux';
import { addComment, actionToComment } from '../../actions/commentActions';
import PropTypes from 'prop-types';
import CommentSection from './CommentSection';

function CommentShowcase({ auth, comments, objectId, addComment, actionToComment, type, ...props }) {
  const id = auth.apiUser ? auth.apiUser.id : null;
  return (
    <div>
      <CommentSection 
        user={auth.apiUser ? auth.apiUser.user : null}
        comments={comments}
        objectId={objectId}
        addComment={(user, objectId, text) => addComment(type, user, objectId, text, id)}
        // (id, typeofOpinion, type, commentId, fastIndex)
        likeComment={(objectId, commentId, fastIndex) => actionToComment(objectId, 'like', type, commentId, fastIndex, id)}
        dislikeComment={(objectId, commentId, fastIndex) => actionToComment(objectId, 'dislike', type, commentId, fastIndex, id)}
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