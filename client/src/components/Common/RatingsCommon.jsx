import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './RatingsCommon.styles.css';

// Array of ratings
  /**
   * @param {Array} ratings { puntuation, id }
   * @param {Object} auth {user, id ...}
   * @param {Object} elementWithRatings { __v }
   * @param {Function} setRatings (elementId, i, username, auth.id)
   * @param {String} elementId
   * @param {String} username 
   * @param {Boolean} showTitleGeneral
   */
const propTypes = {  
  ratings: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  elementWithRatings: PropTypes.object.isRequired,
  setRatings: PropTypes.func.isRequired,
  elementId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  comparisonInRatingUpdate: PropTypes.string,
  showTitleGeneral: PropTypes.bool,
}

const defaultProptypes = {
  comparisonInRatingUpdate: null,
  showTitleGeneral: true,
}

const buttonStyle = {
  textDecoration: 'none',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
};

function RatingsCommon({ ratings, auth, elementWithRatings, setRatings, elementId, username, comparisonInRatingUpdate, showTitleGeneral }) {
  const [state, setState] = useState({
    rating: 0,
    actualRating: 0,
    generalRating: 0,
    currentVersion: 0,
    error: null,
  });

  useEffect(() => {
    ratingUpdate();
  }, [ratings, elementWithRatings, state]);

  function handleClick(i) {
    if (auth) {
      setState((prevState) => ({ ...state, actualRating: i }));
      setRatings(
        elementId,
        i,
        username,
        auth.id
      );
    } else {
      setState((prev) => ({
        ...prev,
        error: 'You cannot rate an album if you are not logged!',
      }));
      setTimeout(() => setState((prev) => ({ ...state, error: null })), 2000);
    }
  }

  function ratingUpdate() {    
    if (
      ratings &&
      ratings.length > 0 &&
      elementWithRatings.__v !== state.currentVersion
    ) {
      let actualRating = 0;
      for (const rating of ratings) {
        actualRating += rating.puntuation;
      }
      actualRating /= ratings.length;
      let userRating = null; 
      // Check if it's auth
      if (auth !== null && typeof auth === 'object' && auth !== undefined) {
        if (!comparisonInRatingUpdate && auth) comparisonInRatingUpdate = auth.user;
        userRating = ratings.filter(
          element => String(element.user) === String(comparisonInRatingUpdate)
        );
      }
      console.log(userRating);
      if (userRating && userRating.length > 0) userRating = userRating[0].puntuation;
      else {
        userRating = actualRating;
      }
      setState({
        generalRating: actualRating,
        rating: userRating,
        actualRating: userRating,
        currentVersion: elementWithRatings.__v,
      });      
    }
  }
  
  const stars = [];
  if (ratings && ratings.length >= 0) {
    for (let i = 0; i < 10; i++) {
      if (i >= state.rating) {
        stars.push(
          <button
            style={buttonStyle}
            onPointerEnter={() => setState({ ...state, rating: i + 1 })}
            onPointerLeave={() =>
              setState({ ...state, rating: state.actualRating })
            }
            key={i}
            onClick={() => handleClick(i + 1)}
          >
            <i className="far fa-star" id={i} style={{ color: '#b29600' }} />
          </button>
        );
      } else {
        stars.push(
          <button
            style={buttonStyle}
            onPointerEnter={() => setState({ ...state, rating: i + 1 })}
            onPointerLeave={() => setState({ ...state, rating: state.actualRating })}
            key={i}
            onClick={() => handleClick(i + 1)}
          >
            <i className="fas fa-star" id={i} style={{ color: '#FFD700' }} />
          </button>
        );
      }
    }
  }
  return (    
    <div>
      {showTitleGeneral ? 
        <div className="box-rating">
          <h3 className="m-3 padding-box">
            Total Score: {state.generalRating.toFixed(2)} / 10
          </h3>
        </div> : null}
      {stars}{' '}      
      <div className="badge badge-primary">{state.actualRating}</div>
      {state.error ? (
        <div className="badge badge-danger ml-3">{state.error}</div>
      ) : null}
    </div>
  )
}

RatingsCommon.propTypes = propTypes;
RatingsCommon.defaultProps = defaultProptypes;

export default RatingsCommon;