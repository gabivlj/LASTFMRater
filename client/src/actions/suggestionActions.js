import { axiosAPI } from '../utils/axios';
import handleError from '../utils/handleError';

export const setLoading = () => {
  return {
    type: 'SET_LOADING_SUGGESTIONS',
  };
};

export const getSuggestions = (type, id, history) => async dispatch => {
  dispatch(setLoading());
  const [response, error] = await handleError(
    axiosAPI.get(`/${type}/suggestion/${id}`),
  );
  dispatch(setLoading());
  if (error) {
    return history.push('/sorry/not/found');
  }

  const { pendingChanges } = response.data;
  return dispatch({ type: 'SET_SUGGESTIONS', payload: pendingChanges });
};
