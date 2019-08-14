/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import {
  getChat,
  sendMessage,
  open,
  ROUTES,
  getChats,
  setChatRoute
} from '../../../actions/chatActions';
import DialogMe from './Dialog/Dialog';
import InputBorderline from '../../Common/InputBorderline';
import GoImage from '../../Common/GoImage';
import Messages from './Dialog/Messages';

function ChatDialog({
  auth,
  chat,
  getChat,
  getChats,
  sendMessage,
  open,
  setChatRoute
}) {
  const [text, setText] = useState('');
  function onChange(e) {
    setText(e.target.value);
  }
  let Render = Messages;
  useEffect(() => {
    console.log(chat.route);
    if (chat.open) {
      switch (chat.route) {
        case ROUTES.CHAT:
          getChat(chat.currentChatInfo.id);
          Render = Messages;
          break;
        case ROUTES.CHATS:
          getChats();

          Render = InputBorderline;
          break;
        case ROUTES.FRIENDS:
          break;
        default:
          break;
      }
    }
  }, [chat.open, chat.route]);

  function handleBack() {
    if (chat.route === ROUTES.CHATS) {
      return open();
    }
    if (chat.route === ROUTES.CHAT) {
      return setChatRoute(ROUTES.CHATS);
    }
    if (chat.route === ROUTES.FRIENDS) {
      return open();
    }
    return null;
  }

  function sendMessageSubm() {
    sendMessage({
      message: text,
      to: chat.currentChatInfo.id,
      toUsername: chat.currentChatInfo.username,
      fromId: auth.id,
      username: auth.user
    });
    setText('');
  }

  function onEnter(e) {
    const keyCode = e.keyCode || e.which;
    // enter keycode
    if (keyCode === 13) {
      sendMessageSubm();
    }
  }

  let messages;
  if (chat.chat && chat.chat.messages && chat.route === ROUTES.CHAT) {
    messages = chat.chat.messages;
  }
  const actions = (
    <div className="row">
      <div className="col-md-8">
        <InputBorderline
          label="Send something!"
          value={text}
          name="Input"
          onChange={onChange}
          multiline={false}
          onKeyDown={onEnter}
        />
      </div>
      <div className="col-md-4 mt-3">
        <Button onClick={sendMessageSubm} value="Send" color="primary">
          Send
        </Button>
      </div>
    </div>
  );
  const otherUser = chat.currentChatInfo ? chat.currentChatInfo.username : null;
  const profileImg = chat.currentChatInfo
    ? chat.currentChatInfo.profileImage
    : null;
  return (
    <div>
      <DialogMe
        Render={Render}
        propsRender={{
          messages,
          otherUser
        }}
        renderActions={actions}
        title={ROUTES.CHAT === chat.route ? otherUser : ''}
        image={
          chat.route === ROUTES.CHAT ? (
            <GoImage
              style={{ height: '60px', width: '60px' }}
              goImg
              src={profileImg}
              className="profileImage borderProfile mr-3"
              alt="The profile caption"
            />
          ) : (
            <></>
          )
        }
        open={chat.open}
        handleClose={() => open()}
        handleBack={handleBack}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  chat: state.chat,
  auth: state.auth.apiUser
});

export default connect(
  mapStateToProps,
  {
    getChat,
    sendMessage,
    open,
    getChats,
    setChatRoute
  }
)(ChatDialog);
