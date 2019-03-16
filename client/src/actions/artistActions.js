import axios from 'axios'

import API_KEYS from '../APIKEYS'

export const getArtist = artist => dispatch => {
  console.log(artist)
  axios
    .get(
      `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${
        artist.name
      }&api_key=${API_KEYS.API_KEY}&format=json`
    )
    .then(res => dispatch({ type: 'SET_ARTIST', payload: res.data }))
    .catch(err => console.log(err))
}
