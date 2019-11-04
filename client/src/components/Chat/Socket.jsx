import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SocketClass from '../../classes/Socket';
import SocketInstance from '../../classes/SocketInstance';
import { receiveMessage } from '../../actions/chatActions';

function Socket({ auth, receiveMessage, ...props }) {
  useEffect(() => {
    if (!auth.auth || !auth.fullyLoaded) {
      return () => {};
    }
    // This means that auth has not loaded fully yet.
    if (!auth.apiUser && !auth.apiUser.listOfFriends) return () => {};
    SocketInstance.socket = new SocketClass(
      auth.apiUser.id,
      receiveMessage,
      auth.apiUser.user,
      auth.apiUser.listOfFriends,
    );
    return () => {
      SocketInstance.socket.close();
      // delete SocketInstance.socket;
    };
  }, [auth.auth, auth.fullyLoaded]);
  return <></>;
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  {
    receiveMessage,
  },
)(Socket);
