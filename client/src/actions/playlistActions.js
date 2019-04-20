import axios from 'axios';
import handleError from '../utils/handleError';
import guidGenerator from '../utils/idCreator';

export const searchTracks = query => async dispatch => {
  const [response, error] = await handleError(
    axios.get(`/api/track/tracks`, {
      params: { searchData: query },
    })
  );
  if (error) {
    return dispatch({
      type: 'ERROR_PLAYLIST',
      payload: error.response.data,
    });
  }
  const { data } = response;
  data.lastfm = data.lastfm.reduce((prev, curr) => {
    curr._id = guidGenerator();
    return [...prev, curr];
  }, []);
  dispatch({
    type: 'SEARCH_TRACK_PLAYLIST',
    payload: data.lastfm,
  });
};

export const addTrack = track => dispatch => {
  if (!track) {
    return;
  }
  dispatch({
    type: 'ADD_TRACK_PLAYLIST',
    payload: track,
  });
};

export const removeTrack = track => dispatch => {
  dispatch({
    type: 'REMOVE_TRACK_PLAYLIST',
    payload: track,
  });
};
