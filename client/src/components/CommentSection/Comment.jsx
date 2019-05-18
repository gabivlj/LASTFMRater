import React from 'react'
import PropTypes from 'prop-types';
import { Fab } from '@material-ui/core';
import { ThumbUp, ThumbDown } from '@material-ui/icons';
import ProfileImage from '../../images/profile.png'

function Comment({img, user, like, dislike, likes, loged, text}) {
  const disabled = loged == null ? true : false;
  return (
    <div className="comment">
      <div className="row">
        <div className="col-md-4">
          <img src={img} alt="Profile" className="comment-image"/>        
        </div>
        <div className="col-md-8">
          <h3>{user}</h3>
          <p className="text-comment">
            { text }
          </p>
          <div className="comment-likes">
            <Fab disabled={disabled} onClick={like}>
              <ThumbUp />              
            </Fab>
            <span className="likes-span">{likes}</span>
            <Fab disabled={disabled} onClick={dislike}>
              <ThumbDown />
            </Fab>
          </div>
        </div>
      </div>
    </div>
  )
}

Comment.propTypes = {
  img: PropTypes.string,
  loged: PropTypes.string,
  like: PropTypes.func.isRequired,
  dislike: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
}

Comment.defaultProps = {
  img: ProfileImage,
  loged: null
}

export default Comment;