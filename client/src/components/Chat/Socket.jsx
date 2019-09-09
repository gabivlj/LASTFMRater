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
    // This means that auth has not loaded fully yet.
    if (!auth.listOfFriends) return () => {};
    SocketInstance.socket = new SocketClass(
      auth.id,
      receiveMessage,
      auth.user,
      auth.listOfFriends,
    );
    return () => {
      SocketInstance.socket.close();
      // delete SocketInstance.socket;
    };
  }, [auth]);
  return <></>;
}

const mapStateToProps = state => ({
  auth: state.auth.apiUser,
});

export default connect(
  mapStateToProps,
  {
    receiveMessage,
  },
)(Socket);
