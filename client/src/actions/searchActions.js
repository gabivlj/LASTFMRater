import axios from 'axios'
import API_KEYS from '../API'

export const searchThingsForSearchBar = searchValue => dispatch => {
  console.log(searchValue)

  axios
    .get(
      `http://ws.audioscrobbler.com/2.0/?method=album.search&api_key=${
        API_KEYS.API_KEY
      }&album=${searchValue}&limit=20&format=json`
    )
    .then(res => {
      console.log(res.data)
      dispatch({
        type: 'SEARCH_ALBUMS',
        payload: res.data.results.albummatches.album
      })
    })
    .catch(err => console.log(err))
}
