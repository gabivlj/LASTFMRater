import React from 'react';
import { Link } from 'react-router-dom';
import activityTypes from '../../utils/activityTypes';
import Stars from '../Profile/Ratings/Stars';

export default function BodyGramp({ type, text, score }) {
  const MAX_LENGTH = 720;
  function returnTextReadMore(text) {
    return (
      <>
        {text}
        <Link to="/">...</Link>
      </>
    );
  }
  if (type === activityTypes.COMMENT) {
    return (
      <div className="gramp-body">
        {text.length > MAX_LENGTH
          ? returnTextReadMore(text.slice(0, MAX_LENGTH))
          : text}
      </div>
    );
  }
  if (
    type === activityTypes.ALBUM_RATING ||
    type === activityTypes.PLAYLIST_RATING
  ) {
    return (
      <div style={{ padding: '0 0 20px 60px' }}>
        <Stars
          puntuation={parseInt(score, 10)}
          generalScore={10}
          color="#4263f5"
        />
      </div>
    );
  }
  if (type === activityTypes.FOLLOWED_USER) {
    return <div />;
  }
  return null;
}
