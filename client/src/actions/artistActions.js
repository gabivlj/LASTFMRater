import handleError from '../utils/handleError';
import { notifyError, notifySuccess } from './notifyActions';
import goImage from '../utils/goImage';
import { axiosAPI } from '../utils/axios';

export const getArtist = artist => dispatch => {
  axiosAPI
    .get(`/artist/${artist.name}?artistId=${artist._id}`)
    .then(res => {
      dispatch({ type: 'SET_ARTIST', payload: res.data.artist });
      axiosAPI
        .get(`/artist/albums/${artist.name}`)
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

export const setArtistForm = artist => dispatch => {
  return dispatch({
    type: 'SET_ARTIST_FORM',
    payload: artist,
  });
};

export const uploadImageArtist = (file, images = [], id) => async dispatch => {
  const [res, error] = await goImage(file);
  if (error) {
    return dispatch(notifyError('Error uploading an image request.'));
  }
  const { data } = res;
  const [finalResponse, err] = await handleError(
    axiosAPI.post(`/artist/update/${id}`, {
      body: { images: [...(images || []), data] },
    }),
  );
  if (err) {
    return dispatch(notifyError('Error uploading an update request.'));
  }
  return console.log(finalResponse.data);
};

export const uploadUpdateArtist = (body, artist, history) => async dispatch => {
  const [, err] = await handleError(
    axiosAPI.post(`/artist/update/${artist._id}`, { body }),
  );
  if (err) {
    return dispatch(notifyError('Error uploading an update request.'));
  }
  history.push(`/artist/${artist.name}/${artist._id}`);
  return null;
};

export const getArtistForm = artist => dispatch => {
  axiosAPI
    .get(`/artist/${artist.name}?artistId=${artist._id}`)
    .then(res => {
      dispatch(setArtistForm(res.data.artist));
    })
    .catch(err => console.log(err));
};
