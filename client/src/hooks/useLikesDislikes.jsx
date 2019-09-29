import { useState, useEffect } from 'react';
import Axios from 'axios';
import handleError from '../utils/handleError';

function useLikesDislikes(commentID) {
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
        Axios.get(`/api/comments/get/${commentID}`),
      );
      if (error) {
        return setStateOfLikes(previousState => ({
          ...previousState,
          refusedConnection: true,
        }));
      }
      const { likes, dislikes, liked, disliked } = response.data;
      return setStateOfLikes(previousState => ({
        ...previousState,
        likes,
        disliked,
        liked,
        dislikes,
      }));
    })();
  }, []);

  async function like() {
    const [response, error] = await handleError(
      Axios.post(`/api/comments/like/${commentID}`),
    );

    if (error) {
      console.log(error);
      return setStateOfLikes(previousState => ({
        ...previousState,
        refusedConnection: true,
      }));
    }

    const { likes, dislikes, liked, disliked } = response.data.comment;
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
      Axios.post(`/api/comments/dislike/${commentID}`),
    );

    if (error) {
      console.log(error);
      return setStateOfLikes(previousState => ({
        ...previousState,
        refusedConnection: true,
      }));
    }

    const { likes, dislikes, liked, disliked } = response.data.comment;
    console.log(likes, dislikes);
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

export default useLikesDislikes;
