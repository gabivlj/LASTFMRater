import { useState, useEffect } from 'react';
import handleError from '../utils/handleError';
import { axiosAPI } from '../utils/axios';

/**
 * @description useLikesDislikesV2 is different from useLikesDislikes.jsx because this uses the Opinion API
 * @param {String} objectID The objectID that you wanna like.
 */
function useLikesDislikesV2(objectID) {
  const [state, setStateOfLikes] = useState({
    likes: 0,
    dislikes: 0,
    liked: false,
    disliked: false,
    refusedConnection: false,
  });

  useEffect(() => {
    (async () => {
      const [response, error] = await handleError(
        axiosAPI.get(`/opinions/${objectID}`),
      );
      if (error) {
        if (error.response.status === 404) {
          const {
            likes,
            dislikes,
            liked,
            disliked,
          } = error.response.data.opinion;
          return setStateOfLikes(previousState => ({
            ...previousState,
            likes,
            disliked,
            liked,
            dislikes,
          }));
        }
        return setStateOfLikes(previousState => ({
          ...previousState,
          refusedConnection: true,
        }));
      }
      const { likes, dislikes, liked, disliked } = response.data.opinion;
      return setStateOfLikes(previousState => ({
        ...previousState,
        likes,
        disliked,
        liked,
        dislikes,
      }));
    })();
  }, [objectID]);

  async function like() {
    const [response, error] = await handleError(
      axiosAPI.post(`/opinions/opinion/${objectID}/likes`),
    );

    if (error) {
      return setStateOfLikes(previousState => ({
        ...previousState,
        refusedConnection: true,
      }));
    }

    const { likes, dislikes, liked, disliked } = response.data.opinion;
    return setStateOfLikes(previousState => ({
      ...previousState,
      likes,
      disliked,
      liked,
      dislikes,
    }));
  }

  async function dislike() {
    const [response, error] = await handleError(
      axiosAPI.post(`/opinions/opinion/${objectID}/dislikes`),
    );

    if (error) {
      console.log(error);
      return setStateOfLikes(previousState => ({
        ...previousState,
        refusedConnection: true,
      }));
    }

    const { likes, dislikes, liked, disliked } = response.data.opinion;
    return setStateOfLikes(previousState => ({
      ...previousState,
      likes,
      disliked,
      liked,
      dislikes,
    }));
  }

  return [
    state.likes,
    state.liked,
    state.dislikes,
    state.disliked,
    like,
    dislike,
    state.refusedConnection,
  ];
}

export default useLikesDislikesV2;
