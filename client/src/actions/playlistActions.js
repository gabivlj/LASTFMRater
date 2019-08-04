/* eslint-disable no-param-reassign */
import axios from 'axios';
import handleError from '../utils/handleError';
import guidGenerator from '../utils/idCreator';
import getIfUserLikedOrNot from '../utils/getIfUserLikedOrNot';
import mapLikesDislikes from '../utils/mapLikesDislikes';
import { notifyNormality, notifySuccess, notifyError } from './notifyActions';

export const searchTracks = query => async dispatch => {
  const [response, error] = await handleError(
    axios.get(`/api/track/tracks`, {
      params: { searchData: query }
    })
  );
  if (error) {
    return dispatch({
      type: 'ERROR_PLAYLIST',
      payload: error.response.data
    });
  }
  const { data } = response;
  data.lastfm = data.lastfm.reduce((prev, curr) => {
    curr._id = guidGenerator();
    return [...prev, curr];
  }, []);
  dispatch({
    type: 'SEARCH_TRACK_PLAYLIST',
    payload: data.lastfm
  });
};

export const addTrack = track => dispatch => {
  if (!track) {
    return;
  }
  dispatch(notifyNormality('Track added!'), 1000);
  dispatch({
    type: 'ADD_TRACK_PLAYLIST',
    payload: track
  });
};

export const removeTrack = track => dispatch => {
  dispatch({
    type: 'REMOVE_TRACK_PLAYLIST',
    payload: track
  });
};

export const sendPlaylist = (
  user,
  playlistName,
  playlistDescription,
  playlistCover,
  history,
  tracks = []
) => async dispatch => {
  const sendToApi = {
    user,
    playlistName,
    playlistDescription,
    playlistCover,
    tracks
  };
  dispatch({
    type: 'SENDING_PLAYLIST'
  });
  const [response, errors] = await handleError(
    axios.post('/api/playlist', sendToApi)
  );
  if (errors) {
    return dispatch({ type: 'ERRORS_PLAYLIST_CREATION' });
  }
  history.push(`/playlist/view/${response.data.playlist._id}`);
  dispatch(notifySuccess('Playlist created!', 2000));
  return dispatch({
    type: 'SUCCESFUL_API_CALL_PLAYLIST'
  });
};

export const getPlaylist = (_id, userId) => async dispatch => {
  const query = userId ? `?userId=${userId}` : '';
  const [playlist, error] = await handleError(
    axios.get(`/api/playlist/${_id}${query}`)
  );
  if (error) console.log(error.response.data);
  let comments = getIfUserLikedOrNot(playlist.data.playlist.comments, userId);
  comments = mapLikesDislikes(playlist.data.playlist.comments);
  playlist.data.playlist.comments = comments;
  dispatch({
    type: 'SET_PLAYLIST',
    payload: playlist.data.playlist
  });
};

export const deleteTrackFromPlaylist = (
  trackId,
  playlistId,
  index = null
) => async dispatch => {
  const [tracks, error] = await handleError(
    axios.post(`/api/playlist/delete/${playlistId}/${trackId}`, {
      indexToDeleteFrom: index
    })
  );
  if (error) {
    console.log(error);
    return dispatch({
      type: 'ERROR_DELETE_TRACK_FROM_PLAYLIST'
    });
  }
  dispatch(notifySuccess('Track deleted!', 1500));
  return dispatch({
    type: 'DELETE_TRACK_FROM_PLAYLIST',
    payload: {
      trackId,
      tracks: tracks.data.tracks,
      index
    }
  });
};

export const addToPlaylistFromPlaylistEdit = (
  track,
  playlistId
) => async dispatch => {
  const [response, error] = await handleError(
    axios.post(`/api/playlist/${playlistId}`, track)
  );
  if (error) {
    return console.log(error);
  }
  return dispatch({
    type: 'ADD_TRACK_PLAYLIST_EDIT',
    payload: {
      newTrack: response.data.newTrack
    }
  });
};

export const interchangeTracks = (
  index1,
  index2,
  playlistId,
  tracksShow
) => async dispatch => {
  const [res, error] = await handleError(
    axios.post(`/api/playlist/change/${index1}/${index2}`, {
      playlistId,
      tracksShow
    })
  );
  if (error) {
    notifyError('Error! Try to reload the page!', 5000);
    return null;
  }
  const { data } = res;
  return dispatch({
    type: 'SET_TRACKS',
    payload: data
  });
};

export const setTracks = (
  indexToInterchange,
  indexToSetFrom
) => async dispatch => {};

/**
 * @param {String} playlistId
 * @param {Number} puntuation
 * @param {String} username
 * @param {String} userid
 * @todo TODO: We need to make tbis work still.
 */
export const addPlaylistRating = (
  playlistId,
  puntuation,
  username,
  userid
) => dispatch => {
  const infoToSendToApi = { puntuation, userId: username };
  axios
    .post(`/api/playlist/rate/${playlistId}`, infoToSendToApi)
    .then(res => {
      dispatch(notifyNormality('Rating added!', 1500));
      dispatch({
        type: 'ADD_PLAYLIST_RATING',
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

export const cleanPlaylist = () => dispatch => {
  return dispatch({
    type: 'CLEAN_PLAYLIST'
  });
};
