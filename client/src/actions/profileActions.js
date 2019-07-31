import axios from 'axios';
import uuid from 'uuid/v1';
import handleError from '../utils/handleError';
import { notifySuccess } from './notifyActions';

export const getPlaylists = userName => async dispatch => {
  dispatch({
    type: 'LOADING_PLAYLISTS_PROFILE'
  });
  const [response, error] = await handleError(
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
  return dispatch({
    type: 'SET_PLAYLISTS_PROFILE',
    payload: playlists
  });
};

export const getProfile = id => async dispatch => {
  dispatch({
    type: 'LOADING_PROFILE'
  });
  const [response, error] = await handleError(axios.get(`/api/profile/${id}`));

  if (error) {
    return dispatch({
      type: 'ERROR_GETTING_PROFILE',
      payload: error.response.data.error
    });
  }
  const { data } = response;
  return dispatch({
    type: 'GET_PROFILE_FULL',
    payload: data
  });
};

export const setListenedArtists = lastfm => async dispatch => {
  if (lastfm) {
    const [response, error] = await handleError(
      axios.get(`/api/user/artists/${lastfm}`)
    );
    if (error) {
      return dispatch({ type: 'ERROR_LOADING_ARTISTS ' });
    }
    return dispatch({
      type: 'GET_ARTISTS_PROFILE'
    });
  }
  return null;
};

export const cleanErrors = () => dispatch => {
  return dispatch({
    type: 'CLEAN_ERRORS'
  });
};

export const uploadImage = file => async dispatch => {
  const fileData = new FormData();
  fileData.append('grumpy-file', file, uuid());
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  };
  const [res, error] = await handleError(
    axios.post('http://localhost:2222/api/image', fileData, config)
  );
  if (error) return console.log('error');
  const { data } = res;
  const { lz, md, lg, sm } = data;
  const [final, err] = await handleError(
    axios.post('/api/profile/image', { lz, md, lg, sm })
  );
  if (err) return console.log('error2');
  dispatch(notifySuccess('Image uploaded succesfuly!', 2000));
  return dispatch({
    type: 'UPDATE_PROFILE',
    payload: { images: final.data.user.images }
  });
};
