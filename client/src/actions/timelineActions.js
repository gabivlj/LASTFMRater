import Axios from 'axios';
import handleError from '../utils/handleError';
import { notifyError } from './notifyActions';

export const loading = () => ({ type: 'LOADING_TIMELINE' });

export const loadGramps = () => async dispatch => {
  dispatch(loading());
  const [res, error] = await handleError(Axios.get('/api/profile/gramps'));
  if (error) {
    dispatch(notifyError('Error loading timeline!'));
    return error;
  }
  const { data } = res;
  const { gramps } = data;

  return dispatch({
    type: 'SET_GRAMPS',
    payload: gramps
  });
};
