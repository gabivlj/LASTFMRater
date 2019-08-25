import React from 'react';
import CommentIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import StarIcon from '@material-ui/icons/Star';
import activityTypes from '../../utils/activityTypes';

export default function IconTimeline({ type }) {
  const iconStyles = {
    width: '35px',
    height: '35px',
    marginTop: '5.8px',
    marginLeft: '17.5px',
    color: '#4263f5'
  };
  if (type === activityTypes.COMMENT) return <CommentIcon style={iconStyles} />;
  if (
    type === activityTypes.ALBUM_RATING ||
    type === activityTypes.PLAYLIST_RATING
  )
    return <StarIcon style={iconStyles} />;
  return <></>;
}
