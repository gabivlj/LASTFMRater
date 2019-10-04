/* eslint-disable prettier/prettier */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './RatingsCommon.styles.css';

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
  elementWithRatings: PropTypes.object.isRequired,
  setRatings: PropTypes.func.isRequired,
  elementId: PropTypes.string.isRequired,
  username: PropTypes.string,
  comparisonInRatingUpdate: PropTypes.string,
  auth: PropTypes.object,
  showTitleGeneral: PropTypes.bool,
  ratings: PropTypes.array,
};

const defaultProptypes = {
  comparisonInRatingUpdate: null,
  showTitleGeneral: true,
  auth: null,
  username: '',
  ratings: [],
};

const buttonStyle = {
  textDecoration: 'none',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
};

/**
 * @PARAMS_DESCRIPTION
 * @param {Array} Ratings Array
 * @param {Object} Auth Object (In Grumpy social network redux it's apiUser)
 * @param {Object} elementWithRatings Is the mongodb object, with __v and _id.
 * @param {Callback} setRatings Is a function that sets the ratings, params: ( item_id, rating, username, user_id )
 * @param {String} elementId
 * @param {String} username
 * @param {String} comparisonInRatingUpdate What you wanna compare .user to.
 * @param {Boolean} showTitleGeneral If you wanna show the total score
 */
function RatingsCommon({
  ratings,
  auth,
  elementWithRatings,
  setRatings,
  elementId,
  username,
  comparisonInRatingUpdate,
  showTitleGeneral,
}) {
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

  /**
   * @param {Number} i, puntuation
   * @description Handles a click on a star.
   */
  function handleClick(i) {
    if (auth) {
      setState(prevState => ({ ...state, actualRating: i }));
      setRatings(elementId, i, username, auth.id);
      return;
    }
    // If not loged. TODO: Maybe make a possibility of executing a passed callback right here?
    setState(prev => ({
      ...prev,
      error: 'You cannot rate an album if you are not logged!',
    }));
    setTimeout(() => setState(prev => ({ ...state, error: null })), 2000);
  }

  /**
   * @description Updates the rating if there is any changes.
   */
  function ratingUpdate() {
    if (
      ratings &&
      ratings.length > 0 &&
      // Checkes the version of the database and the current version.
      elementWithRatings.__v !== state.currentVersion
    ) {
      // let generalRating = 0;
      // for (const rating of ratings) {
      //   generalRating += rating.puntuation;
      // }
      const sumRating = ratings.reduce((p, c) => p + c.puntuation, 0);
      const generalRating = sumRating / ratings.length;
      let userRating = null;
      // Check if it's auth
      if (auth !== null && typeof auth === 'object' && auth !== undefined) {
        if (!comparisonInRatingUpdate && auth)
          comparisonInRatingUpdate = auth.user;
        userRating = ratings.filter(
          element => String(element.user) === String(comparisonInRatingUpdate),
        );
      }
      if (userRating && userRating.length > 0)
        userRating = userRating[0].puntuation;
      else {
        userRating = generalRating;
      }
      setState({
        // The general rating (What the social network thinks of this.)
        generalRating,
        // The user rating for checking the current stars
        rating: userRating,
        // The actual rating of the user.
        actualRating: userRating,
        // Updates the current database version on component's state.
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
            type="button"
            style={buttonStyle}
            // It sets this star as the current star.
            onPointerEnter={() => setState({ ...state, rating: i + 1 })}
            onPointerLeave={() =>
              // When it leaves it sets it as before.
              setState({ ...state, rating: state.actualRating })
            }
            key={i}
            onClick={() => handleClick(i + 1)}
          >
            <i className="far fa-star" id={i} style={{ color: '#4263f5' }} />
          </button>,
        );
      } else {
        stars.push(
          <button
            type="button"
            style={buttonStyle}
            onPointerEnter={() => setState({ ...state, rating: i + 1 })}
            onPointerLeave={() =>
              setState({ ...state, rating: state.actualRating })
            }
            key={i}
            onClick={() => handleClick(i + 1)}
          >
            <i className="fas fa-star" id={i} style={{ color: '#4263f5' }} />
          </button>,
        );
      }
    }
  }
  return (
    <div>
      {showTitleGeneral ? (
        <div className="box-rating">
          <h3 className="m-3 padding-box">
            Total Score: 
            {' '}
            {state.generalRating.toFixed(2)}
            {' '}
/ 10
          </h3>
        </div>
      ) : null}
      {stars} 
      {' '}
      <div className="badge badge-primary">{state.actualRating}</div>
      {state.error ? (
        <div className="badge badge-danger ml-3">{state.error}</div>
      ) : null}
    </div>
  );
}

RatingsCommon.propTypes = propTypes;
RatingsCommon.defaultProps = defaultProptypes;

export default RatingsCommon;
