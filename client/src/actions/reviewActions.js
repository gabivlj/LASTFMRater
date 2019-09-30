import axios from 'axios';
import handleError from '../utils/handleError';
import { notifyError } from './notifyActions';

const getReview = _id => async dispatch => {
  const [response, error] = await handleError(
    axios.get(`/api/reviews/review/${_id}`),
  );
  if (error) {
    return dispatch(notifyError('Error getting the review.'));
  }
  return dispatch({
    type: 'GET_REVIEW',
    payload: { review: response.data.review },
  });
};

const updateReview = (
  review,
  history = 'todo: THIS IS FOR PUSHING TO ANOTHER PAGE LATER',
) => async dispatch => {
  const [response, err] = await handleError(
    axios.post('/api/reviews/update', review),
  );
  if (err) {
    return dispatch(notifyError('Error updating the review.'));
  }

  return dispatch({
    type: 'GET_REVIEW',
    payload: { review: response.data.review },
  });
};

const getReviews = objectId => async dispatch => {
  console.error('NOT IMPLEMENTED');
};

const getMyReviews = () => async dispatch => {};
