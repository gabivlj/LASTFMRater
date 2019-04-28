import axios from 'axios';
import handleError from '../utils/handleError';

export const getPlaylists = userId => async dispatch => {
  dispatch({
    type: 'LOADING_PLAYLISTS_PROFILE',
  })
  const [{ data } , error] = await handleError(
    axios.get(`/api/playlist/user/${userId}`)
  );
  // If erorr console log and dispatch error
  if (error) {
    console.log(error);
    return dispatch({
      type: 'ERROR_GETTING_PLAYLIST_FROM_USER'
    });
  }
  // else set in redux the playlist
  const { playlists } = data;
  dispatch({
    type: 'SET_PLAYLISTS_PROFILE',
    payload: playlists,
  });
}