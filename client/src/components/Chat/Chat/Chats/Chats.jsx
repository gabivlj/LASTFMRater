import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import ChatItem from './ChatItem';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

function Chats({
  chats,
  loading,
  classes,
  setChatRoute,
  setChatInfo,
  username,
}) {
  let chatsRender;
  if (chats) {
    chatsRender = chats.map(chat => (
      <ChatItem
        chat={chat}
        key={chat._id}
        setChatInfo={setChatInfo}
        setChatRoute={setChatRoute}
        username={username}
      />
    ));
  }
  return <List className={classes.root}>{chatsRender}</List>;
}

export default withStyles(styles)(Chats);
