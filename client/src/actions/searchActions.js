import axios from 'axios'
import API_KEYS from '../API'

export const searchThingsForSearchBar = searchValue => dispatch => {
  axios
    .get(
      `http://ws.audioscrobbler.com/2.0/?method=album.search&api_key=${
        API_KEYS.API_KEY
      }&album=${searchValue}&limit=6&format=json`
    )
    .then(res => {
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
    // const response = await axios.get(
    //   `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${search}&api_key=${
    //     API_KEYS.API_KEY
    //   }&page=${page}&limit=${limit}&format=json`
    // )
    const response = await axios.get(`/api/album/search/${search}`, {
      params: {
        limit,
        page
      }
    })
    dispatch({
      type: 'SEARCH_ALBUMS_FOR_SEARCH',
      payload: response.data
    })
  } catch (err) {
    console.log(err)
  }
}

export const searchArtists = (name, limit = 5, page = 1) => async dispatch => {
  if (page <= 0) page = 1
  try {
    const response = await axios.get(`/api/artist/search/${name}`, {
      params: {
        limit,
        page
      }
    })
    const { data } = response
    dispatch({ type: 'SEARCH_ARTISTS_FOR_SEARCH', payload: data })
  } catch (err) {
    // TODO ->! yeah maybe at this point we should create a errors reducer, we'll handle it later though !
    console.log(err)
  }
}
