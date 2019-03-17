import axios from 'axios'
import API_KEYS from '../API'
import md5 from '../utils/md5'
import User from '../classes/User'

export const setUser = token => async dispatch => {
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
    .then(async res => {
      const user = new User(res.data)

      dispatch({
        type: 'SET_USER',
        payload: user
      })
      const apiUser = await axios.post('/api/user', user)
      dispatch({
        type: 'SET_API_USER',
        payload: apiUser.data
      })
    })
    .catch(err => console.log(err))
}

export const setFullUserFromSession = () => async dispatch => {
  const localStorageSession = JSON.parse(localStorage.getItem('session'))
  dispatch({ type: 'SET_USER', payload: localStorageSession })
  const apiUser = await axios.post('/api/user', localStorageSession)
  dispatch({
    type: 'SET_API_USER',
    payload: apiUser.data
  })
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
