import axios from 'axios'
import API_KEYS from '../API'

export const searchThingsForSearchBar = searchValue => dispatch => {
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

// TODO => We may create later a god awful function for searching everything. God bless
export const searchAlbums = (search, limit = 5, page = 1) => async dispatch => {
  if (page <= 0) page = 1
  try {
    const response = await axios.get(
      `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${search}&api_key=${
        API_KEYS.API_KEY
      }&page=${page}&limit=${limit}&format=json`
    )
    console.log('DATA FROM API RECEIVED:::', response.data)
    dispatch({
      type: 'SEARCH_ALBUMS_FOR_SEARCH',
      payload: response.data.results.albummatches.album
    })
  } catch (err) {
    console.log(err)
  }
}
