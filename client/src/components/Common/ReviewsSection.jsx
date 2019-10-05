import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { getReviews, cleanReviews } from '../../actions/reviewActions';
import ScrollerLoader from './ScrollerLoader';
import ReviewItem from './Review/ReviewItem';

function ReviewsSection({
  type,
  objectID,
  getReviews,
  reviewState,
  cleanReviews,
  profile,
}) {
  let currentReviews = 0;
  const ADDER_REVIEWS = 3;
  function getReviewsScroll(e) {
    getReviews(
      objectID,
      currentReviews,
      currentReviews + ADDER_REVIEWS,
      type,
      profile,
    );
    currentReviews += ADDER_REVIEWS + 1;
  }
  useEffect(() => () => cleanReviews(), []);
  const { reviews, loading } = reviewState;
  return (
    <ScrollerLoader
      uuid="REVIEW_SECTION"
      style={{ maxHeight: '500px', width: '100%', minHeight: '200px' }}
      actionWhenBottom={getReviewsScroll}
      preload
    >
      <div>
        {reviews &&
          reviews.map(review => (
            <ReviewItem
              puntuation={review.puntuation}
              username={review.username}
              text={review.text}
              key={review._id}
              id={review._id}
              profile={profile}
              album={profile && review.album}
            />
          ))}
        {loading && <LinearProgress />}
      </div>
    </ScrollerLoader>
  );
}

ReviewsSection.propTypes = {
  type: PropTypes.string.isRequired,
  objectID: PropTypes.string.isRequired,
  getReviews: PropTypes.func.isRequired,
  reviewState: PropTypes.shape({
    review: PropTypes.object,
    loading: PropTypes.bool,
  }).isRequired,
  cleanReviews: PropTypes.func.isRequired,
  profile: PropTypes.bool,
};

ReviewsSection.defaultProps = {
  profile: false,
};

const mapStateToProps = state => ({
  reviewState: state.review,
});

export default connect(
  mapStateToProps,
  { getReviews, cleanReviews },
)(ReviewsSection);
