import axios from 'axios';
import handleError from '../utils/handleError';

export const getPlaylists = userName => async dispatch => {
  dispatch({
    type: 'LOADING_PLAYLISTS_PROFILE',
  })
  const [response , error] = await handleError(
    axios.get(`/api/profile/playlists/${userName}`)
  );
  // If erorr console log and dispatch error
  if (error) {
    console.log(error.response.data);
    return dispatch({
      type: 'ERROR_GETTING_PLAYLIST_FROM_USER'
    });
  }
  const { data } = response;
  // else set in redux the playlist
  const { playlists } = data;
  dispatch({
    type: 'SET_PLAYLISTS_PROFILE',
    payload: playlists,
  });
}

export const getProfile = (id) => async dispatch => {
  dispatch({
    type: 'LOADING_PROFILE'
  });
  const [response , error] = await handleError(
    axios.get(`/api/profile/${id}`)
  );

  if (error) {
    return dispatch({
      type: 'ERROR_LOADING_PROFILE',
      payload: error.response.data
    });
  }
  const { data } = response;
  dispatch({
    type: 'GET_PROFILE_FULL',
    payload: data,
  });
}