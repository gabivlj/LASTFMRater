import axios from 'axios';
import handleError from '../utils/handleError';
import { notifyError } from './notifyActions';

const setLoading = () => ({ type: 'SET_LOADING_REVIEW' });

export const postReview = (history, objectId) => async dispatch => {
  dispatch(setLoading());
  const [response, err] = await handleError(
    axios.post('/api/reviews', { objectID: objectId }),
  );
  if (err) {
    return dispatch(notifyError('Error creating a review!!'));
  }
  const { review } = response.data;
  dispatch({
    type: 'SET_REVIEW_EDITOR',
    payload: review,
  });
  history.push(`/review/edit/${review._id}`);
  return true;
};

export const cleanReviewEditor = () => dispatch =>
  dispatch({ type: 'CLEAN_REVIEW_EDIT' });

export const cleanReview = () => dispatch => dispatch({ type: 'CLEAN_REVIEW' });

export const cleanReviews = () => dispatch =>
  dispatch({ type: 'CLEAN_REVIEWS' });

export const getReviewEditor = _id => async dispatch => {
  dispatch(setLoading());
  const [response, error] = await handleError(
    axios.get(`/api/reviews/reviews/review/me/${_id}`),
  );
  if (error) {
    return dispatch(notifyError('Error getting the review.'));
  }
  return dispatch({
    type: 'SET_REVIEW_EDITOR',
    payload: response.data.review,
  });
};

export const updateReview = (review, history) => async dispatch => {
  dispatch(setLoading());
  const [response, err] = await handleError(
    axios.post('/api/reviews/update', review),
  );
  if (err) {
    return dispatch(notifyError('Error updating the review.'));
  }

  return dispatch({
    type: 'SET_REVIEW_EDITOR',
    payload: response.data.review,
  });
};

export const getReviewsHidden = (
  beginningIndex = 0,
  endingIndex = 10,
  type,
) => {
  return new Promise(async (res, err) => {
    const [response, error] = await handleError(
      axios.get('/api/reviews/reviews/user/auth', {
        params: {
          reviewType: type,
          startingIndex: beginningIndex,
          endingIndex,
        },
      }),
    );
    if (error) {
      return err(error);
    }
    return res(response.data);
  });
};

export const getReviews = (
  objectId,
  beginningIndex = 0,
  endingIndex = 10,
  type,
  profile = false,
  show = true,
) => async dispatch => {
  dispatch(setLoading());
  if (!show) {
    const [response, err] = await handleError(
      getReviewsHidden(beginningIndex, endingIndex, type),
    );

    if (err) {
      console.log(err);
      return dispatch(notifyError('Error getting reviews'));
    }
    return dispatch({
      type: 'ADD_REVIEWS',
      payload: response.reviews,
    });
  }
  const [response, err] = await handleError(
    axios.get(`/api/reviews/reviews/object/${objectId}`, {
      params: {
        reviewType: type,
        startingIndex: beginningIndex,
        endingIndex,
        profile: profile ? 'YES' : 'NO',
      },
    }),
  );
  if (err) {
    console.log(err);
    return dispatch(notifyError('Error getting reviews'));
  }
  return dispatch({
    type: 'ADD_REVIEWS',
    payload: response.data.reviews,
  });
};

const getMyReviews = () => async dispatch => {};
