import axios from 'axios';
import handleError from '../utils/handleError';
import mapLikesDislikes from '../utils/mapLikesDislikes';
import getIfUserLikedOrNot from '../utils/getIfUserLikedOrNot';
import { notifyNormality, notifyError } from './notifyActions';
import goImage from '../utils/goImage';
import uploadImageRoute from '../utils/uploadImageRoute';

export const likeAlbum = id => async dispatch => {
  const [response, err] = await handleError(
    axios.post(`/api/album/loved/${id}`),
  );
  if (err) {
    return dispatch(notifyError('Error liking album'));
  }
  const { data } = response;
  const { album } = data;
  dispatch({
    type: 'UPDATE_ALBUM',
    payload: {
      liked: album,
    },
  });
  if (!album) return {};
  const [res, error] = await handleError(
    axios.get(`/api/album/recommend_like/${id}`),
  );
  if (error) return console.log(error);
  console.log(res);
};

export const getAlbum = albumData => async dispatch => {
  if (albumData.mbid === '0') albumData.mbid = null;
  console.log(albumData);
  const username = albumData.username ? `?username=${albumData.username}` : '?';
  const userId = `&userId=${albumData.userId}&mbid=${albumData.mbid}`;

  axios
    .get(
      `/api/album/${albumData.albumname}/${albumData.artist}${username}${userId}`,
    )
    .then(res => {
      dispatch({
        type: 'GET_ALBUM',
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
};

export const addAlbumRating = (
  albumId,
  puntuation,
  username,
  userid,
) => dispatch => {
  const infoToSendToApi = { puntuation, userid: username };

  axios
    .post(`/api/album/rate/${albumId}`, infoToSendToApi)
    .then(res => {
      const { user } = res.data;
      dispatch(notifyNormality('Rating added!', 1500));
      dispatch({
        type: 'SET_RATING_USER',
        payload: user,
      });
      dispatch({
        type: 'ADD_ALBUM',
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
  // axios
  //   .post('/api/user/rate', { userid, albumId })
  //   .then(res => {
  //     dispatch(notifyNormality('Rating added!', 1500));
  //     dispatch({
  //       type: 'SET_RATING_USER',
  //       payload: res.data,
  //     });
  //   })
  //   .catch(err => console.log(err));
};

export const addComment = (user, album, text) => async dispatch => {
  const [response, error] = await handleError(
    axios.post(`/api/album/comment/${album}`, { text, username: user }),
  );
  if (error) {
    return dispatch({
      type: 'ERROR_ADDING_COMMENT_ALBUM',
    });
  }
  const { data } = response;
  const comments = mapLikesDislikes(data.comments);
  return dispatch({
    type: 'ADD_COMMENT_ALBUM',
    payload: { comments },
  });
};

/**
 * @param {String} albumId
 * @param {String} commentId
 * @param {Number} fastIndex
 */
export const likeComment = (
  albumId,
  commentId,
  fastIndex,
) => async dispatch => {
  const [response, error] = await handleError(
    axios.post(`/api/album/comment/like/${albumId}/${commentId}`, {
      fastIndex,
    }),
  );
  if (error) {
    dispatch({
      type: 'ERROR_LIKING_COMMENT',
    });
  }
  const { data } = response;
  // Now mapLikesDislikes the comments.
  const comments = mapLikesDislikes(data.comments);
  dispatch({
    // Maybe generalize this ??
    type: 'ADD_COMMENT_ALBUM',
    payload: {
      comments,
    },
  });
};

export const uploadImage = (file, id) => async dispatch => {
  const [res, error] = await goImage(file);
  if (error) {
    notifyError('Error adding image to the server...', 3000);
    return console.log('error');
  }
  const { data } = res;
  const _ = await uploadImageRoute(
    `/api/profile/image/upload/${id}`,
    dispatch,
    images => ({
      type: 'UPDATE_ALBUM',
      payload: { images },
    }),
    data,
  );
  return _;
};

// Form actions album.
export const uploadUpdateAlbum = () => async dispatch => {};
