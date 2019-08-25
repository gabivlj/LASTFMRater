import CommentIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import StarIcon from '@material-ui/icons/Star';

import React from 'react';
import activityTypes from './activityTypes';
import Stars from '../components/Profile/Ratings/Stars';

export const getBodyTimeline = (type, { score, text }) => {
  if (type === activityTypes.COMMENT) {
    return <div className="gramp-body">{text}</div>;
  }
  if (
    type === activityTypes.ALBUM_RATING ||
    type === activityTypes.PLAYLIST_RATING
  ) {
    return (
      <div style={{ padding: '0 0 0 60px' }}>
        <Stars
          puntuation={parseInt(score, 10)}
          color="#4263f5"
          generalScore={10}
        />
      </div>
    );
  }
  return null;
};

export const getIconRender = type => {
  const iconStyles = {
    width: '35px',
    height: '35px',
    marginTop: '5.8px',
    marginLeft: '17.5px',
    color: '#4263f5'
  };
  if (type === activityTypes.COMMENT) return <CommentIcon style={iconStyles} />;
  if (
    type === activityTypes.ALBUM_RATING ||
    type === activityTypes.PLAYLIST_RATING
  )
    return <StarIcon style={iconStyles} />;
  return null;
};
