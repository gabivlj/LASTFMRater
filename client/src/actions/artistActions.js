import axios from 'axios'

import API_KEYS from '../API'

export const getArtist = artist => dispatch => {
  console.log(artist)
  // Mbid doesn't work well with the LASTFm api :/
  axios
    .get(
      `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${
        artist.name
      }&api_key=${API_KEYS.API_KEY}&format=json`
    )
    .then(res => dispatch({ type: 'SET_ARTIST', payload: res.data }))
    .catch(err => console.log(err))
  axios
    .get(
      `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${
        artist.name
      }&api_key=${API_KEYS.API_KEY}&format=json`
    )
    .then(res => dispatch({ type: 'SET_ARTIST_ALBUMS', payload: res.data }))
    .catch(err => console.log(err))
}

export const cleanArtist = () => dispatch => {
  dispatch({
    type: 'SET_ARTIST',
    payload: null
  })
  dispatch({
    type: 'SET_ARTIST_ALBUMS',
    payload: null
  })
}
