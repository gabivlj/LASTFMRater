/* eslint-disable no-param-reassign */
import handleError from '../utils/handleError';
import guidGenerator from '../utils/idCreator';
import { notifyNormality, notifySuccess, notifyError } from './notifyActions';
import { axiosAPI } from '../utils/axios';

export const searchTracks = query => async dispatch => {
  const [response, error] = await handleError(
    axiosAPI.get(`/track/tracks`, {
      params: { searchData: query },
    }),
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
  dispatch(notifyNormality('Track added!'), 1000);
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

export const sendPlaylist = (
  user,
  playlistName,
  playlistDescription,
  playlistCover,
  history,
  tracks = [],
) => async dispatch => {
  const sendToApi = {
    user,
    playlistName,
    playlistDescription,
    playlistCover,
    tracks,
  };
  dispatch({
    type: 'SENDING_PLAYLIST',
  });
  const [response, errors] = await handleError(
    axiosAPI.post('/playlist', sendToApi),
  );
  if (errors) {
    return dispatch({ type: 'ERRORS_PLAYLIST_CREATION' });
  }
  history.push(`/playlist/view/${response.data.playlist._id}`);
  dispatch(notifySuccess('Playlist created!', 2000));
  return dispatch({
    type: 'SUCCESFUL_API_CALL_PLAYLIST',
  });
};

export const getPlaylist = (_id, userId) => async dispatch => {
  const query = userId ? `?userId=${userId}` : '';
  const [playlist, error] = await handleError(
    axiosAPI.get(`/playlist/${_id}${query}`),
  );
  if (error) console.log(error.response.data);
  dispatch({
    type: 'SET_PLAYLIST',
    payload: playlist.data.playlist,
  });
};

export const deleteTrackFromPlaylist = (
  trackId,
  playlistId,
  index = null,
) => async (dispatch, store) => {
  const promise = handleError(
    axiosAPI.post(`/playlist/delete/${playlistId}/${trackId}`, {
      indexToDeleteFrom: index,
    }),
  );
  dispatch({
    type: 'DELETE_TRACK_FROM_PLAYLIST',
    payload: {
      trackId,
      tracks: store().playlist.playlist.tracks,
      index,
    },
  });
  const [[tracks, error]] = await Promise.all([promise]);
  if (error) {
    console.log(error);
    dispatch(notifyError('Error saving data to server... Reload page!'));
    return dispatch({
      type: 'ERROR_DELETE_TRACK_FROM_PLAYLIST',
    });
  }
  dispatch(notifySuccess('Track deleted!', 1500));
  return dispatch({
    type: 'DELETE_TRACK_REAFIRM',
    payload: {
      // trackId,
      tracks: tracks.data.tracks,
      // index,
    },
  });
};

export const addToPlaylistFromPlaylistEdit = (
  track,
  playlistId,
) => async dispatch => {
  const [response, error] = await handleError(
    axiosAPI.post(`/playlist/${playlistId}`, track),
  );
  if (error) {
    return console.log(error);
  }
  return dispatch({
    type: 'ADD_TRACK_PLAYLIST_EDIT',
    payload: {
      newTrack: response.data.newTrack,
    },
  });
};

export const interchangeTracks = (
  index1,
  index2,
  playlistId,
  tracksShow,
) => async dispatch => {
  const promise = handleError(
    axiosAPI.post(`/playlist/change/${index1}/${index2}`, {
      playlistId,
      tracksShow,
    }),
  );
  const subs1 = tracksShow[index1];
  tracksShow[index1] = tracksShow[index2];
  tracksShow[index1] = subs1;
  dispatch({
    type: 'SET_TRACKS',
    payload: {
      tracksForShowing: tracksShow,
      tracksId: [],
    },
  });
  const [[res, error]] = await Promise.all([promise]);
  if (error) {
    notifyError('Error! Try to reload the page!', 5000);
    return null;
  }
  const { data } = res;
  return dispatch({
    type: 'SET_TRACKS',
    payload: data,
  });
};

export const setTracks = (
  indexToInterchange,
  indexToSetFrom,
) => async dispatch => {};

/**
 * @param {String} playlistId
 * @param {Number} puntuation
 * @param {String} username
 * @param {String} userid
 * @deprecated
 */
export const addPlaylistRating = (
  playlistId,
  puntuation,
  username,
  userid,
) => dispatch => {
  const infoToSendToApi = { puntuation, userId: username };
  axiosAPI
    .post(`/playlist/rate/${playlistId}`, infoToSendToApi)
    .then(res => {
      dispatch(notifyNormality('Rating added!', 1500));
      dispatch({
        type: 'ADD_PLAYLIST_RATING',
        payload: { playlist: res.data.playlist },
      });
    })
    .catch(err => console.log(err));
};

export const cleanPlaylist = () => dispatch => {
  return dispatch({
    type: 'CLEAN_PLAYLIST',
  });
};
