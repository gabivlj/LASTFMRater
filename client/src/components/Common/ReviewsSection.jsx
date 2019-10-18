import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { getReviews, cleanReviews } from '../../actions/reviewActions';
import ScrollerLoader from './ScrollerLoader';
import ReviewItem from './Review/ReviewItem';
import ProfileImg from '../../images/profile.png';

/**
 * @param {String} type The type of reviews, I think we are just gonna use albums but just incase...
 * @param {String} objectID The object ID, it will be the user if it's a profile, it will be an album if its an album... etc
 * @param {Function} getReviews Redux function.
 * @param {Object} reviewState Redux object state
 * @param {Function} cleanreviews Redux function
 * @param {Boolean} profile Boolean that says if this is in a profile (So it loads only the reviews of the user.)
 * @param {Boolean} show Boolean that says if the reviews with show: true or show: false should be rendered
 * @param {Boolean} cleanReviewsWhenDestroy Boolean that says if the reviews should be cleaned when the component is not rendering.
 * @param {String} uuid when we are having various ReviewsSections.
 * @description ReviewSection includes a ScrollerLoader component, it loads the specified reviews (Depending on the ObjectID or if it's a profile or the type)
 */
function ReviewsSection({
  type,
  objectID,
  getReviews,
  reviewState,
  cleanReviews,
  profile,
  show,
  cleanReviewsWhenDestroy,
  profileImage,
  uuid,
}) {
  let currentReviews = 0;
  const ADDER_REVIEWS = 3;
  function getReviewsScroll() {
    getReviews(
      objectID,
      currentReviews,
      currentReviews + ADDER_REVIEWS,
      type,
      profile,
      show,
    );
    currentReviews += ADDER_REVIEWS + 1;
  }
  useEffect(() => () => cleanReviewsWhenDestroy && cleanReviews(), []);
  const { reviews, loading } = reviewState;
  const profileImg = review => {
    if (review.userProfileImages[0]) {
      return review.userProfileImages[0].md;
    }
    return ProfileImg;
  };
  return (
    <ScrollerLoader
      uuid={uuid}
      style={{ maxHeight: '500px', width: '100%', minHeight: '200px' }}
      actionWhenBottom={getReviewsScroll}
      preload
    >
      <div>
        {reviews &&
          reviews.map(
            review =>
              review.show === show && (
                <ReviewItem
                  puntuation={review.puntuation}
                  username={review.username}
                  text={review.text}
                  key={review._id}
                  id={review._id}
                  profile={profile}
                  image={profile ? profileImage.image : profileImg(review)}
                  goImg={profile ? true : !!review.userProfileImages[0]}
                  album={profile && review.album}
                />
              ),
          )}
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
  show: PropTypes.bool,
  cleanReviewsWhenDestroy: PropTypes.bool,
  uuid: PropTypes.string,
};

ReviewsSection.defaultProps = {
  profile: false,
  show: true,
  cleanReviewsWhenDestroy: true,
  uuid: 'REVIEWS_SCROLLER',
};

const mapStateToProps = state => ({
  reviewState: state.review,
});

export default connect(
  mapStateToProps,
  { getReviews, cleanReviews },
)(ReviewsSection);
