import React from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ChatIcon from '@material-ui/icons/Chat';
import { open } from '../../actions/chatActions';

function ChatButton({ open }) {
  return (
    <IconButton color="inherit" onClick={() => open()}>
      <ChatIcon />
    </IconButton>
  );
}

export default connect(
  null,
  { open }
)(ChatButton);
