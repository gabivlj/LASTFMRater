import React from 'react';
import { Fab } from '@material-ui/core';
import { ThumbUp, ThumbDown } from '@material-ui/icons';
import useLikesDislikesV2 from '../../hooks/useLikesDislikesV2';

export default function Likes({ objectID, disabled }) {
  const [
    likes,
    liked,
    dislikes,
    disliked,
    like,
    dislike,
    refusedConnection,
  ] = useLikesDislikesV2(objectID);
  const red = '#f23077';
  const blue = '#5476f2';

  const likedDisp = liked ? blue : 'black';
  const dislikedDisp = disliked ? red : 'black';
  return (
    <div>
      <div className="comment-likes">
        <Fab
          disabled={disabled}
          onClick={e => {
            e.stopPropagation();
            like(e);
          }}
          className="fab-left"
        >
          <ThumbUp style={{ color: likedDisp }} />
        </Fab>
        <span className="likes-span">{likes - dislikes}</span>
        <Fab
          disabled={disabled}
          onClick={e => {
            e.stopPropagation();
            dislike(e);
          }}
        >
          <ThumbDown style={{ color: dislikedDisp }} />
        </Fab>
      </div>
    </div>
  );
}
