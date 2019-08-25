import React from 'react';
import activityTypes from '../../utils/activityTypes';
import Stars from '../Profile/Ratings/Stars';

export default function BodyGramp({ type, text, score }) {
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
          generalScore={10}
          color="#4263f5"
        />
      </div>
    );
  }
  return null;
}
