import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SocketClass from '../../classes/Socket';
import SocketInstance from '../../classes/SocketInstance';
import { sendMessage, receiveMessage } from '../../actions/chatActions';

function Socket({ auth, sendMessage, receiveMessage, ...props }) {
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
  const send = () => {
    sendMessage({
      message: 'Hey',
      to: '5cb88d162cd2833752b67fba',
      username: auth.user
    });
  };
  return (
    <div>
      <h1>
        Chat
        {auth ? auth.id : 'No loged'}
        <button onClick={send} type="button">
          Send
        </button>
      </h1>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth.apiUser
});

export default connect(
  mapStateToProps,
  {
    sendMessage,
    receiveMessage
  }
)(Socket);
