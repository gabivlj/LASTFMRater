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

const styles = () => ({
  inline: {
    display: 'inline'
  }
});

function ChatItem({ chat, classes, setChatRoute, setChatInfo }) {
  let image;
  let imageMd;
  const lastMessage =
    chat.messages && chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1]
      : '';
  if (chat && chat.images && chat.images.length > 0) {
    imageMd = chat.images[0].md;
    image = `http://localhost:2222/api/image/${
      chat.images[0].md.split('.')[0]
    }`;
  }
  return (
    <ListItem
      alignItems="flex-start"
      button
      onClick={() => {
        setChatInfo({
          username: chat.users[chat.otherUser].username,
          profileImage: imageMd
            ? { image: imageMd, go: true }
            : {
                image: profile,
                go: false
              },
          id: chat.users[chat.otherUser].id
        });
        setChatRoute(ROUTES.CHAT);
      }}
    >
      <ListItemAvatar>
        <Avatar alt={chat.username} src={image || profile} />
      </ListItemAvatar>
      <ListItemText
        primary={chat.users[chat.otherUser].username}
        secondary={(
          <React.Fragment>
            <Typography
              component="span"
              className={classes.inline}
              color="textPrimary"
            >
              {`${lastMessage.username}: `}
            </Typography>
            {lastMessage.text}
          </React.Fragment>
)}
      />
    </ListItem>
  );
}

export default withStyles(styles)(ChatItem);
