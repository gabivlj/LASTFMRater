import axios from 'axios'
import API_KEYS from '../APIKEYS'
import md5 from '../utils/md5'
import convert from 'xml-js'
import User from '../classes/User'

export const setUser = token => dispatch => {
  axios
    .get(
      `http://ws.audioscrobbler.com/2.0?token=${token}&api_key=${
        API_KEYS.API_KEY
      }&api_sig=${md5(
        `api_key${API_KEYS.API_KEY}methodauth.getSessiontoken${token}${
          API_KEYS.SECRET
        }`
      )}&method=auth.getSession`
    )
    .then(res => {
      const user = new User(res.data)
      dispatch({
        type: 'SET_USER',
        payload: user
      })
    })
    .catch(err => console.log(err))
}

export const setUsersArtists = name => dispatch => {
  if (name)
    axios
      .get(
        `http://ws.audioscrobbler.com/2.0/?method=library.getartists&api_key=${
          API_KEYS.API_KEY
        }&user=${name}&format=json`
      )
      .then(res => {
        dispatch({
          type: 'SET_USER_ARTISTS',
          payload: res.data
        })
      })
      .catch(err => console.log(err))
}
