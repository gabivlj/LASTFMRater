import React from 'react'
import Stars from './Stars';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const propTypes = {
  rating: PropTypes.number.isRequired,
  generalScore: PropTypes.number.isRequired,
  artistName: PropTypes.string.isRequired,
  albumName: PropTypes.string.isRequired,
  mbid: PropTypes.string,
};

function Rating({ rating, generalScore, artistName, albumName, mbid }) {
  return (
    <div>
      <div className="row">
        <div className="col-md-4">
          <Link to={`/album/${artistName}/${albumName}/${mbid}`}>{albumName}</Link> by {artistName}
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