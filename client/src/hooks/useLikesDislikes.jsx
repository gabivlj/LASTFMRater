import { useState, useEffect } from 'react';

function useLikesDislikes(commentID) {
  const [state, setStateOfLikes] = useState({
    likes: 0,
    dislikes: 0,
    liked: false,
    disliked: false,
    refusedConnection: false,
  });

  useEffect(() => {
    (async () => {})();
  }, []);

  function like() {}

  function dislike() {}

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
