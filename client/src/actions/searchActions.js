import API_KEYS from '../API';
import handleError from '../utils/handleError';
import { axiosAPI, axiosFM } from '../utils/axios';

export const searchThingsForSearchBar = searchValue => dispatch => {
  axiosFM
    .get(
      `/?method=album.search&api_key=${API_KEYS.API_KEY}&album=${searchValue}&limit=6&format=json`,
    )
    .then(res => {
      dispatch({
        type: 'SEARCH_ALBUMS',
        payload: res.data.results.albummatches.album,
      });
    })
    .catch(err => console.log(err));
};

// TODO => We may create later a god awful function for searching everything. God bless
export const searchAlbums = (search, limit = 5, page = 1) => async dispatch => {
  if (page <= 0) page = 1;
  try {
    const response = await axiosAPI.get(`/album/search/${search}`, {
      params: {
        limit,
        page,
      },
    });
    dispatch({
      type: 'SEARCH_ALBUMS_FOR_SEARCH',
      payload: response.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const searchArtists = (name, limit = 5, page = 1) => async dispatch => {
  if (page <= 0) page = 1;
  try {
    const response = await axiosAPI.get(`/artist/search/${name}`, {
      params: {
        limit,
        page,
      },
    });
    const { data } = response;
    dispatch({ type: 'SEARCH_ARTISTS_FOR_SEARCH', payload: data });
  } catch (err) {
    // TODO ->! yeah maybe at this point we should create a errors reducer, we'll handle it later though !
    console.log(err);
  }
};

export const searchPlaylists = (
  query,
  limit = 5,
  page = 1,
) => async dispatch => {
  page = page <= 0 ? 1 : page;
  const [response, error] = await handleError(
    axiosAPI.get(`/playlist/search/${query}`),
  );
  if (error) {
    return dispatch({
      type: 'ERROR_FINDING_PLAYLIST_SEARCH',
    });
  }
  const { data } = response;
  dispatch({
    type: 'SEARCH_PLAYLISTS_FOR_SEARCH',
    payload: data.playlists,
  });
};

export const searchProfiles = (
  query,
  limit = 5,
  page = 1,
) => async dispatch => {
  page = page <= 0 ? 1 : page;
  const [response, error] = await handleError(
    axiosAPI.get(`/profile/search/${query}`),
  );
  if (error) {
    return dispatch({
      type: 'ERROR_FINDING_PLAYLIST_SEARCH',
    });
  }
  const { data } = response;
  dispatch({
    type: 'SEARCH_PROFILES_FOR_SEARCH',
    payload: data.profiles,
  });
};
