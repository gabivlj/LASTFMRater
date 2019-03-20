import axios from 'axios'
import API_KEYS from '../API'

export const getAlbum = albumData => dispatch => {
  let mbidString = ''
  // if (albumData.mbid) mbidString = `&mbid:${albumData.mbid}`
  console.log(albumData)
  let username
  if (albumData.username) {
    username = `&username=${albumData.username}`
  } else username = ''

  axios
    .get(
      `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${
        API_KEYS.API_KEY
      }&artist=${albumData.artist}&album=${
        albumData.albumname
      }${mbidString}${username}&format=json`
    )
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
        type: 'SET_API_USER',
        payload: res.data
      })
    })
    .catch(err => console.log(err))
}
