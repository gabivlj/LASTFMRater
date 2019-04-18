import axios from 'axios'

export const getAlbum = albumData => dispatch => {
  let username = albumData.username ? `?username=${albumData.username}` : ''
  axios
    .get(`/api/album/${albumData.albumname}/${albumData.artist}${username}`)
    .then(res => {
      dispatch({
        type: 'GET_ALBUM',
        payload: res.data
      })
    })
    .catch(err => console.log(err))
  axios
    .post('/api/album', albumData)
    .then(res => dispatch({ type: 'ADD_ALBUM', payload: res.data }))
    .catch(err => dispatch({ type: 'ALBUM_BEING_ADDED', payload: '' }))
}

export const addAlbumRating = (albumId, puntuation, userid) => dispatch => {
  let infoToSendToApi = { puntuation, userid }
  axios
    .post(`/api/album/rate/${albumId}`, infoToSendToApi)
    .then(res => {
      dispatch({
        type: 'ADD_ALBUM',
        payload: res.data
      })
    })
    .catch(err => console.log(err))
  axios
    .post('/api/user/rate', { name: userid, albumId })
    .then(res => {
      dispatch({
        type: 'SET_RATING_USER',
        payload: res.data
      })
    })
    .catch(err => console.log(err))
}
