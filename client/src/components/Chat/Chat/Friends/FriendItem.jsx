/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import profile from '../../../../images/profile.png';
import { ROUTES } from '../../../../actions/chatActions';
import linksHttp from '../../../../utils/links.http';

const styles = () => ({
  inline: {
    display: 'inline'
  }
});

function FriendItem({
  friendInfo,
  connected,
  setChatInfo,
  setChatRoute,
  classes
}) {
  let image;
  let imageMd;

  if (friendInfo && friendInfo.images && friendInfo.images.length > 0) {
    imageMd = friendInfo.images[0].md;
    image = `${linksHttp.GO_IMAGE}/api/image/${
      friendInfo.images[0].md.split('.')[0]
    }`;
  }
  return (
    <ListItem
      alignItems="flex-start"
      button
      onClick={() => {
        setChatInfo({
          username: friendInfo.username,
          profileImage: imageMd
            ? { image: imageMd, go: true }
            : {
                image: profile,
                go: false
              },
          id: friendInfo._id
        });
        setChatRoute(ROUTES.CHAT);
      }}
    >
      <ListItemAvatar>
        <Avatar alt={friendInfo.username} src={image || profile} />
      </ListItemAvatar>
      <ListItemText
        primary={friendInfo.username}
        secondary={(
          <React.Fragment>
            <Typography
              component="span"
              className={classes.inline}
              color="textPrimary"
            >
              {connected ? (
                <span className="badge badge-success">On</span>
              ) : (
                <span className="badge badge-danger">Off</span>
              )}
            </Typography>
          </React.Fragment>
)}
      />
    </ListItem>
  );
}

export default withStyles(styles)(FriendItem);
