import axios from 'axios';

export const getArtist = artist => dispatch => {
  axios
    .get(`/api/artist/${artist.name}?artistId=${artist._id}`)
    .then(res => {
      dispatch({ type: 'SET_ARTIST', payload: res.data.artist });
      axios
        .get(`/api/artist/albums/${artist.name}`)
        .then(res => {
          dispatch({ type: 'SET_ARTIST_ALBUMS', payload: res.data });
        })
        .catch(err => console.log(err));
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
