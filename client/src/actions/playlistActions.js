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

export const sendPlaylist = (user, playlistName, playlistDescription, playlistCover, history, tracks = []) => 
    async dispatch => {
  const sendToApi = { user, playlistName, playlistDescription, playlistCover, tracks };
  dispatch({
    type: 'SENDING_PLAYLIST'
  })
  const [response, errors] = await handleError(
    axios.post('/api/playlist', sendToApi)
  );
  if (errors) {
    return dispatch({ type: 'ERRORS_PLAYLIST_CREATION'});
  } 
  dispatch({
    type: 'SUCCESFUL_API_CALL_PLAYLIST'
  });
  
  history.push('/me/profile');
}

export const getPlaylist = _id => async dispatch => {
  const [playlist, error] = await handleError(axios.get(`/api/playlist/${_id}`));
  if (error) console.log(error.response.data)
  dispatch({
    type: 'SET_PLAYLIST',
    payload: playlist.data.playlist,
  })
}

export const deleteTrackFromPlaylist = (trackId, playlistId, index = null) => async dispatch => {
  const [tracks, error] = await handleError(
    axios.post(`/api/playlist/delete/${playlistId}/${trackId}`, { indexToDeleteFrom: index})
  );
  if (error) {
    console.log(error);
    return dispatch({
      type: 'ERROR_DELETE_TRACK_FROM_PLAYLIST'
    });
  }
  dispatch({
    type: 'DELETE_TRACK_FROM_PLAYLIST',
    payload: {
      trackId, 
      tracks: tracks.data.tracks,
      index
    }
  });
}

export const addToPlaylistFromPlaylistEdit = (track, playlistId) => async dispatch => {
  const [response, error] = await handleError(
    axios.post(`/api/playlist/${playlistId}`, track)
  );
  if (error) {
    return console.log(error);
  } 
  console.log(response.data);
  dispatch({
    type: 'ADD_TRACK_PLAYLIST_EDIT',
    payload: {
      newTrack: response.data.newTrack      
    }
  })
}