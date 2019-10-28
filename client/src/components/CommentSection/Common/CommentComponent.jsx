import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LinearProgress } from '@material-ui/core';
import {
  comment,
  addOpinionToComment,
  getComments,
  setLoading,
  setComments,
  cleanComments,
} from '../../../actions/commentActions';

import CommentSection from '../CommentSection';
import guidGenerator from '../../../utils/idCreator';

/**
 * @description Component that you only have to pass the objectId and it will handle the rest for your comment section. It's very
 * useful because we won't need to refactor the children of this Component. Also we will delete the Comment Library that it was made
 * before for handling the comment sections.
 */
function CommentComponent({
  objectId,
  numberOfCommentsAdd,
  auth,
  comments,
  comment,
  addOpinionToComment,
  getComments,
  setLoading,
  cleanComments,
  location,
  name,
  paddingIfNotLoaded,
  useOwnOnScroll,
  answer,
  preloadSomeComments,
  // Check if use the overlay array or the other.
  isOverlay,
}) {
  // Redux refactoring.
  const userId = auth.apiUser ? auth.apiUser.id : null;
  const userName = auth.apiUser ? auth.apiUser.user : null;
  const { loaded, showCommentOverlay } = comments;
  const [current, setCurrentNOfComments] = useState(0);
  let timeoutForLoading = false;
  const { pathname } = location;

  // UseEffect
  useEffect(() => {
    if (preloadSomeComments && current === 0 && !isOverlay) {
      setLoading();
      // We do the update of the comments here because otherwise I don't know how we will get the prev value.
      setCurrentNOfComments(prev => {
        getComments(objectId, 0, prev + numberOfCommentsAdd, userId);
        // Tell the browser not to load again in 3s.
        timeoutForLoading = true;
        setTimeout(() => {
          timeoutForLoading = false;
        }, 1000);
        // Update.
        return prev + numberOfCommentsAdd;
      });
    }
    function checkBottom() {
      // When scrolling to the bottom of the component, reload comments.
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 20 &&
        loaded &&
        !timeoutForLoading &&
        (!useOwnOnScroll && !comments.showCommentOverlay)
      ) {
        setLoading();
        // We do the update of the comments here because otherwise I don't know how we will get the prev value.
        setCurrentNOfComments(prev => {
          getComments(objectId, 0, prev + numberOfCommentsAdd, userId);
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
    if (!useOwnOnScroll) {
      document.addEventListener('scroll', checkBottom);
      // Remove the EventListener
      return () => {
        // Destroy
        setCurrentNOfComments(0);
        document.removeEventListener('scroll', checkBottom);
        cleanComments();
      };
    }
    return () => {};
  }, [objectId]);

  // After UseEffect function declarations
  /**
   * @description passed fn. to CommentSection (Check component for more information).
   */
  function like(_, commentId, fastIndex) {
    addOpinionToComment('like', commentId, fastIndex);
  }
  /**
   * @description passed fn. to CommentSection (Check component for more information).
   */
  function dislike(_, commentId, fastIndex) {
    addOpinionToComment('dislike', commentId, fastIndex);
  }
  /**
   * @description passed fn. to CommentSection (Check component for more information).
   */
  function commentSubmit(user, _, txt) {
    comment(user, txt, objectId, pathname, name, answer);
  }

  return (
    <>
      <CommentSection
        key={guidGenerator()}
        addComment={commentSubmit}
        likeComment={like}
        dislikeComment={dislike}
        objectId={objectId}
        comments={isOverlay ? comments.commentsOverlay : comments.comments}
        user={userName}
      />
      {paddingIfNotLoaded && comments.comments.length === 0 ? (
        <div style={{ paddingBottom: '2000px' }} />
      ) : null}
      {/* We do this second check so it doesnt appear loading while the overlay comment section is loading */}
      {!loaded && (isOverlay || !showCommentOverlay) ? (
        <LinearProgress />
      ) : null}
    </>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
  comments: state.comments,
});

CommentComponent.propTypes = {
  objectId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  comment: PropTypes.func.isRequired,
  addOpinionToComment: PropTypes.func.isRequired,
  getComments: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  cleanComments: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  comments: PropTypes.shape({
    comments: PropTypes.array.isRequired,
    loaded: PropTypes.bool.isRequired,
  }),
  numberOfCommentsAdd: PropTypes.number,
  paddingIfNotLoaded: PropTypes.bool,
  useOwnOnScroll: PropTypes.bool,
  answer: PropTypes.bool,
  preloadSomeComments: PropTypes.bool,
  isOverlay: PropTypes.bool,
};

CommentComponent.defaultProps = {
  comments: [],
  numberOfCommentsAdd: 20,
  paddingIfNotLoaded: false,
  useOwnOnScroll: false,
  answer: false,
  preloadSomeComments: true,
  isOverlay: false,
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      comment,
      addOpinionToComment,
      getComments,
      setLoading,
      setComments,
      cleanComments,
    },
  )(CommentComponent),
);
