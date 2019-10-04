import React, { useState } from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import { getReviews } from '../../actions/reviewActions';
import ScrollerLoader from './ScrollerLoader';
import ReviewItem from './Review/ReviewItem';

function ReviewsSection({ type, objectID, getReviews, reviewState }) {
  let currentReviews = 0;
  const ADDER_REVIEWS = 3;
  function getReviewsScroll(e) {
    getReviews(objectID, currentReviews, currentReviews + ADDER_REVIEWS, type);
    currentReviews += ADDER_REVIEWS + 1;
  }
  const { reviews, loading } = reviewState;
  return (
    <ScrollerLoader
      uuid="REVIEW_SECTION"
      style={{ height: '200px', width: '100%', minHeight: '200px' }}
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
            />
          ))}
        {loading ? <LinearProgress /> : false}
      </div>
    </ScrollerLoader>
  );
}

const mapStateToProps = state => ({
  reviewState: state.review,
});

export default connect(
  mapStateToProps,
  { getReviews },
)(ReviewsSection);
