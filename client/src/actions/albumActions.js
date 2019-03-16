import axios from 'axios'
import API_KEYS from '../API'

export const getAlbum = albumData => dispatch => {
  let mbidString = ''
  // if (albumData.mbid) mbidString = `&mbid:${albumData.mbid}`
  console.log(albumData)
  axios
    .get(
      `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${
        API_KEYS.API_KEY
      }&artist=${albumData.artist}&album=${
        albumData.albumname
      }${mbidString}&format=json`
    )
    .then(res => {
      dispatch({
        type: 'GET_ALBUM',
        payload: res.data
      })
    })
    .catch(err => console.log(err))
}
