/* eslint-disable prettier/prettier */
import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import profile from '../../../images/profile.png';
import linksHttp from '../../../utils/links.http';

function RecommendedFriend({ friend, history }) {
  const { images, username, _id } = friend;
  let image;
  let imageMd;

  if (images && images.length > 0) {
    imageMd = images[0].md;
    image = `${linksHttp.GO_IMAGE}/api/image/${images[0].md.split('.')[0]}`;
  } else {
    image = profile;
  }
  return (
    <div>
      <ListItem
        alignItems="flex-start"
        button
        onClick={() => {
          history.push(`/profile/${username}`);
        }}
      >
        <ListItemAvatar>
          <Avatar alt={username} src={image} />
        </ListItemAvatar>
        <ListItemText
          primary={username}
          secondary={(
            <React.Fragment>
              <button
                className="btn btn-sm btn-primary"
                // style={{ padding: '3px', height:  }}
                type="submit"
              >
                Follow
              </button>
            </React.Fragment>
)}
        />
      </ListItem>
    </div>
  );
}

export default withRouter(RecommendedFriend);
