import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Fab } from '@material-ui/core';
import { ThumbUp, ThumbDown } from '@material-ui/icons';
import ProfileImage from '../../images/profile.png';
import { setCommentOverlay, cleanComments } from '../../actions/commentActions';
import './Comment.styles.css';

function Comment({
  img,
  user,
  like,
  dislike,
  likes,
  loged,
  text,
  liked,
  disliked,
  _id,
  setCommentOverlay,
  cleanComments,
}) {
  const disabled = loged == null;
  const red = '#f23077';
  const blue = '#5476f2';
  const likedDisp = liked ? blue : 'black';
  const dislikedDisp = disliked ? red : 'black';
  const commentOverlay = event => {
    event.stopPropagation();
    setCommentOverlay({ _id, img, username: user, text });
  };
  return (
    <div
      className="comment"
      role="button"
      onKeyDown={commentOverlay}
      onClick={commentOverlay}
      tabIndex={0}
    >
      <div className="row">
        <div className="col-md-4">
          <img
            src={img || ProfileImage}
            alt="Profile"
            className="comment-image"
          />
        </div>
        <div className="col-md-8">
          <h3>{user}</h3>
          <p className="text-comment">{text}</p>
          <div className="comment-likes">
            <Fab
              disabled={disabled}
              onClick={e => {
                e.stopPropagation();
                like(e);
              }}
              className="fab-left"
            >
              <ThumbUp style={{ color: likedDisp }} />
            </Fab>
            <span className="likes-span">{likes}</span>
            <Fab
              disabled={disabled}
              onClick={e => {
                e.stopPropagation();
                dislike(e);
              }}
            >
              <ThumbDown style={{ color: dislikedDisp }} />
            </Fab>
          </div>
        </div>
      </div>
    </div>
  );
}

Comment.propTypes = {
  img: PropTypes.string,
  loged: PropTypes.string,
  liked: PropTypes.bool,
  disliked: PropTypes.bool,
  like: PropTypes.func.isRequired,
  dislike: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  _id: PropTypes.string.isRequired,
  setCommentOverlay: PropTypes.func.isRequired,
};

Comment.defaultProps = {
  img: ProfileImage,
  loged: null,
  liked: false,
  disliked: false,
};

export default connect(
  () => ({}),
  { setCommentOverlay, cleanComments },
)(Comment);
