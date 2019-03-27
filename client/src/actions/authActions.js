import axios from 'axios'
import API_KEYS from '../API'
import md5 from '../utils/md5'
import User from '../classes/User'

export const setUser = (
  token,
  history = null,
  typeoflogin = null
) => async dispatch => {
  axios
    .get(`/api/user/${token}`)
    .then(async res => {
      const user = new User(res.data)
      console.log(user)
      localStorage.setItem('session', JSON.stringify(user))
      const apiUser = await axios.post('/api/user', user)
      dispatch({
        type: 'SET_USER',
        payload: user
      })
      dispatch({
        type: 'SET_API_USER',
        payload: apiUser.data
      })
      if (history) history.push(`/me/profile`)
    })
    .catch(err => console.log(err))
  // axios
  //   .get(
  //     `http://ws.audioscrobbler.com/2.0?token=${token}&api_key=${
  //       API_KEYS.API_KEY
  //     }&api_sig=${md5(
  //       `api_key${API_KEYS.API_KEY}methodauth.getSessiontoken${token}${
  //         API_KEYS.SECRET
  //       }`
  //     )}&method=auth.getSession`
  //   )
  //   .then(async res => {
  //     const user = new User(res.data)
  //     localStorage.setItem('session', JSON.stringify(user))
  //     dispatch({
  //       type: 'SET_USER',
  //       payload: user
  //     })
  //     const apiUser = await axios.post('/api/user', user)
  //     dispatch({
  //       type: 'SET_API_USER',
  //       payload: apiUser.data
  //     })
  //     // For anti-bug purposes, we redirect when we finish setting the user
  //     if (history) history.push(`/me/profile`)
  //   })
  //   .catch(err => console.log(err))
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

/**
 * @description Get the artists that the user listens to in Lastfm.
 */

export const setUsersArtists = name => dispatch => {
  if (name)
    axios
      .get(`/api/user/artists/${name}`)
      .then(res => {
        dispatch({
          type: 'SET_USER_ARTISTS',
          payload: res.data
        })
      })
      .catch(err => console.log(err.response.data))
}
// http://ws.audioscrobbler.com/2.0/?method=library.getartists&api_key=${
//   API_KEYS.API_KEY
// }&user=${name}&format=json
