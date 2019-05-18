import axios from 'axios';

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
  const [error, response] = 
    await axios.post(`/api/album/comment/${album}`, { text, username: user });
  if (error) {
    return dispatch({
      type: 'ERROR_ADDING_COMMENT_ALBUM',
    });
  }

  dispatch({
    type: 'ADD_COMMENT_ALBUM',
    payload: response.data,
  });

}