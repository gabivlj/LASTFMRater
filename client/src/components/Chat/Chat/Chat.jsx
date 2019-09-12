import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getChat, sendMessage } from '../../../actions/chatActions';

function Chat({ auth, chat, match, getChat, sendMessage }) {
  useEffect(() => {
    getChat(match.params.id);
  }, []);
  function sendMessageSubm(e) {
    e.preventDefault();
    sendMessage({
      message: 'Yes',
      to: match.params.id,
      toUsername: chat.currentChatUsername,
      fromId: auth.id,
      username: auth.user,
    });
  }
  let messages;

  if (chat.chat && chat.chat.messages) {
    messages = chat.chat.messages.map(msg => (
      <div>{`${msg.username}: ${msg.text}`}</div>
    ));
  }
  return (
    <div>
      Chat with
      {match.params.id}
      <div>{messages}</div>
      <form onSubmit={sendMessageSubm}>
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
  chat: state.chat,
  auth: state.auth.apiUser,
});

export default connect(
  mapStateToProps,
  {
    getChat,
    sendMessage,
  },
)(Chat);
