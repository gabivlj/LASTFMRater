import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  puntuation: PropTypes.number.isRequired,
  generalScore: PropTypes.number.isRequired
};

function Stars({ puntuation, generalScore }) {
  const stars = [];
  for (let i = 0; i < generalScore; i++) {
    if (i >= puntuation) {
      stars.push(
        <i
          className="far fa-star"
          id={i}
          key={i}
          style={{ color: '#b29600' }}
        />
      );
    } else {
      stars.push(
        <i
          className="fas fa-star"
          id={i}
          key={i}
          style={{ color: '#FFD700' }}
        />
      );
    }
  }
  return <div>{stars}</div>;
}

Stars.propTypes = propTypes;

export default Stars;
