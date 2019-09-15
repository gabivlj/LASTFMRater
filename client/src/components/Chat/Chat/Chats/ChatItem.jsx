/* eslint-disable prettier/prettier */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Badge } from '@material-ui/core';
import profile from '../../../../images/profile.png';
import { ROUTES } from '../../../../actions/chatActions';
import linksHttp from '../../../../utils/links.http';

const styles = () => ({
  inline: {
    display: 'inline',
  },
});

function ChatItem({ chat, classes, setChatRoute, setChatInfo, username }) {
  let image;
  let imageMd;
  const lastMessage =
    chat.messages && chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1]
      : '';
  if (chat && chat.images && chat.images.length > 0) {
    imageMd = chat.images[0].md;
    image = `${linksHttp.GO_IMAGE}/api/image/${
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
                go: false,
              },
          id: chat.users[chat.otherUser].id,
        });
        setChatRoute(ROUTES.CHAT);
      }}
    >
      <ListItemAvatar>
        <Badge
          badgeContent={
            chat.lastPerson &&
            chat.lastPerson.notification &&
            // its called username but in reality it's an id.
            chat.lastPerson.user !== username
              ? chat.lastPerson.notification
              : 0
          }
          color="primary"
        >
          <Avatar alt={chat.username} src={image || profile} />
        </Badge>
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
