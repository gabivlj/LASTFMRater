import axios from 'axios';
import handleError from '../utils/handleError';
import mapLikesDislikes from '../utils/mapLikesDislikes';

export const getAlbum = albumData => dispatch => {
  const username = albumData.username ? `?username=${albumData.username}` : '';
  axios
    .get(`/api/album/${albumData.albumname}/${albumData.artist}${username}`)
    .then(res => {
      dispatch({
        type: 'GET_ALBUM',
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
  axios
    .post('/api/album', albumData)
};

export const addAlbumRating = (albumId, puntuation, username, userid) => dispatch => {
  const infoToSendToApi = { puntuation, userid: username };
  
  axios
    .post(`/api/album/rate/${albumId}`, infoToSendToApi)
    .then(res => {
      
      dispatch({
        type: 'ADD_ALBUM',
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
  axios
    .post('/api/user/rate', { userid, albumId })
    .then(res => {
      dispatch({
        type: 'SET_RATING_USER',
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
};

export const addComment = (user, album, text) => async dispatch => {
  const [response, error] = await handleError(
    axios.post(`/api/album/comment/${album}`, { text, username: user })
  );
  if (error) {
    return dispatch({
      type: 'ERROR_ADDING_COMMENT_ALBUM',
    });
  }
  const { data } = response;
  const comments = mapLikesDislikes(data.comments);
  dispatch({
    type: 'ADD_COMMENT_ALBUM',
    payload: { comments },
  });
}

/**
 * @param {String} albumId 
 * @param {String} commentId 
 * @param {Number} fastIndex 
 */
export const likeComment = (albumId, commentId, fastIndex) => async dispatch => {
  const [response, error] = await handleError(
    axios.post(`/api/album/comment/like/${albumId}/${commentId}`, { fastIndex })
  );
  if (error) {
    dispatch({
      type: 'ERROR_LIKING_COMMENT'
    })
  }
  const { data } = response;
  // Now mapLikesDislikes the comments.
  const comments = mapLikesDislikes(data.comments);
  dispatch({
    // Maybe generalize this ?? 
    type: 'ADD_COMMENT_ALBUM',
    payload: {
      comments
    }
  });
}