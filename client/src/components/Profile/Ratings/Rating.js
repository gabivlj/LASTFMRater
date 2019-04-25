import React from 'react'
import Stars from './Stars';
import PropTypes from 'prop-types';

const propTypes = {
  rating: PropTypes.number.isRequired,
  generalScore: PropTypes.number.isRequired,
  artistName: PropTypes.string.isRequired,
  albumName: PropTypes.string.isRequired,
};

function Rating({ rating, generalScore, artistName, albumName }) {
  return (
    <div>
      <div className="row">
        <div className="col-md-4">
          {albumName} by {artistName}
        </div>
        <div className="col-md-8">
          <Stars 
            generalScore={generalScore} 
            puntuation={rating}
          />
          {rating} / {generalScore}
        </div>
      </div>
    </div>
  )
}

Rating.propTypes = propTypes;

export default Rating;