import React from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ChatIcon from '@material-ui/icons/Chat';
import { Badge } from '@material-ui/core';
import { open } from '../../actions/chatActions';

function ChatButton({ open, totalNotifications }) {
  return (
    <Badge badgeContent={totalNotifications} color="secondary">
      <IconButton color="inherit" onClick={() => open()}>
        <ChatIcon />
      </IconButton>
    </Badge>
  );
}

const mapStateToProps = state => ({
  totalNotifications: state.chat.totalNotifications,
});

export default connect(
  mapStateToProps,
  { open },
)(ChatButton);
