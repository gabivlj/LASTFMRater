/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import {
  getChat,
  sendMessage,
  open,
  ROUTES,
  getChats,
  setChatRoute,
  setChatInfo
} from '../../../actions/chatActions';
import DialogMe from './Dialog/Dialog';
import InputBorderline from '../../Common/InputBorderline';
import GoImage from '../../Common/GoImage';
import Messages from './Dialog/Messages';
import Chats from './Chats/Chats';
import Friends from './Friends/Friends';

function ChatDialog({
  auth,
  chat,
  getChat,
  getChats,
  sendMessage,
  open,
  setChatRoute,
  setChatInfo
}) {
  function returnRightRender(n) {
    switch (n) {
      case 0:
        return Messages;
      case 1:
        return Chats;
      case 2:
        return Friends;
      default:
        return <></>;
    }
  }
  const [text, setText] = useState('');
  const [render, setRender] = useState(0);
  const { isLoading } = chat;
  function onChange(e) {
    setText(e.target.value);
  }
  useEffect(() => {
    if (chat.open) {
      switch (chat.route) {
        case ROUTES.CHAT:
          getChat(chat.currentChatInfo.id);
          setRender(0);
          break;
        case ROUTES.CHATS:
          getChats();
          setRender(1);
          break;
        case ROUTES.FRIENDS:
          setRender(2);
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
  const actionChat = (
    <div className="row" style={{ width: '95%', overflowX: 'hidden' }}>
      <div className="col-md-10">
        <InputBorderline
          label="Send something!"
          value={text}
          name="Input"
          onChange={onChange}
          multiline={false}
          onKeyDown={onEnter}
        />
      </div>
      <div className="col-md-2 mt-3">
        <IconButton onClick={sendMessageSubm} value="Send" color="primary">
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
  const actions =
    ROUTES.CHAT === chat.route ? actionChat : <div className="pt-3" />;
  const otherUser = chat.currentChatInfo ? chat.currentChatInfo.username : null;
  const profileImg = chat.currentChatInfo
    ? chat.currentChatInfo.profileImage
    : null;
  return (
    <div>
      <DialogMe
        Render={returnRightRender(render)}
        propsRender={{
          messages,
          otherUser,
          chats: chat.chats,
          setChatRoute,
          setChatInfo
        }}
        isLoading={isLoading}
        renderActions={actions}
        title={ROUTES.CHAT === chat.route ? otherUser : ''}
        image={
          chat.route === ROUTES.CHAT && profileImg ? (
            <GoImage
              style={{ height: '60px', width: '60px' }}
              goImg={profileImg.go}
              src={profileImg.image}
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
    setChatRoute,
    setChatInfo
  }
)(ChatDialog);
