import axios from 'axios';

export const getArtist = artist => dispatch => {
  // Mbid doesn't work well with the LASTFm api :/

  axios
    .get(`/api/artist/${artist.name}?artistId=${artist._id}`)
    .then(res => {
      dispatch({ type: 'SET_ARTIST', payload: res.data.artist });
    })
    .catch(err => console.log(err));
  axios
    .get(`/api/artist/albums/${artist.name}`)
    .then(res => {
      dispatch({ type: 'SET_ARTIST_ALBUMS', payload: res.data });
    })
    .catch(err => console.log(err));
};

export const cleanArtist = () => dispatch => {
  dispatch({
    type: 'SET_ARTIST',
    payload: null,
  });
  dispatch({
    type: 'SET_ARTIST_ALBUMS',
    payload: null,
  });
};
