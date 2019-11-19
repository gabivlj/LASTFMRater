import handleError from '../utils/handleError';
import { axiosAPI } from '../utils/axios';
import { notifyError } from './notifyActions';

export const getTrack = (
  trackName,
  artist,
  album,
  mbid = '0',
  username = '',
) => async dispatch => {
  dispatch({
    type: 'SET_LOADING_TRACK_PAGE',
  });
  const [response, error] = await handleError(
    axiosAPI.get(
      `/album/track/${album}/${artist}/${trackName}?mbid=${mbid}&username=${username}`,
    ),
  );
  if (error) {
    console.log(error);
    dispatch(notifyError('Error getting the track...'));
    dispatch({
      type: 'ERROR_GETTING_TRACK',
    });
    return;
  }
  const { track } = response.data;
  dispatch({
    type: 'SET_TRACK_PAGE',
    payload: track,
  });
};

export const cleanTrackPage = () => dispatch =>
  dispatch({ type: 'CLEAN_TRACK_PAGE' });

export const rateTrack = (puntuation, trackID) => dispatch =>
  axiosAPI
    .post(`/album/rate/track/${trackID}`, { puntuation })
    .then(res => dispatch({ type: 'UPDATE_TRACK', payload: res.data.track }))
    .catch(
      err =>
        dispatch({ type: 'ERROR_RATING_TRACK' }) &&
        dispatch(notifyError('Error rating track...')) &&
        console.log(err),
    );
