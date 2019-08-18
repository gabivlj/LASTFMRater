import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SocketClass from '../../classes/Socket';
import SocketInstance from '../../classes/SocketInstance';
import { receiveMessage } from '../../actions/chatActions';

function Socket({ auth, receiveMessage, ...props }) {
  useEffect(() => {
    if (!auth) {
      return () => {};
    }
    SocketInstance.socket = new SocketClass(auth.id, receiveMessage, auth.user);
    return () => {
      SocketInstance.socket.close();
      // delete SocketInstance.socket;
    };
  }, []);
  return <></>;
}

const mapStateToProps = state => ({
  auth: state.auth.apiUser
});

export default connect(
  mapStateToProps,
  {
    receiveMessage
  }
)(Socket);
