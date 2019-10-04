import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  puntuation: PropTypes.number.isRequired,
  generalScore: PropTypes.number.isRequired,
  color: PropTypes.string,
};

const defaultProps = {
  color: '#4263f5',
};

function Stars({ puntuation, generalScore, color }) {
  const stars = [];
  for (let i = 0; i < generalScore; i += 1) {
    if (i >= puntuation) {
      stars.push(
        <i className="far fa-star" id={i} key={i} style={{ color }} />,
      );
    } else {
      stars.push(
        <i className="fas fa-star" id={i} key={i} style={{ color }} />,
      );
    }
  }
  return <div>{stars}</div>;
}

Stars.propTypes = propTypes;
Stars.defaultProps = defaultProps;

export default Stars;
