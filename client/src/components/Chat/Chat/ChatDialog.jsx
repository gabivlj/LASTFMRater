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
  setChatInfo,
  getFriendsProfiles,
} from '../../../actions/chatActions';
import DialogMe from './Dialog/Dialog';
import InputBorderline from '../../Common/InputBorderline';
import GoImage from '../../Common/GoImage';
import Messages from './Dialog/Messages';
import Chats from './Chats/Chats';
import Friends from './Friends/Friends';

/**
 * @description Page for the Chat, handles what to display,
 *  pass props to the current component, and basic stuff for the messaging
 */
function ChatDialog({
  auth,
  chat,
  getChat,
  getChats,
  sendMessage,
  open,
  setChatRoute,
  setChatInfo,
  getFriendsProfiles,
}) {
  // Variables
  const [routeBefore, setRouteBefore] = useState(ROUTES.CHATS);
  const [text, setText] = useState('');
  const [render, setRender] = useState(0);
  const { isLoading } = chat;

  // UseEffect Cycle
  useEffect(() => {
    // If the chat is open, handle the render.
    if (chat.open) {
      switch (chat.route) {
        case ROUTES.CHAT:
          getChat(chat.currentChatInfo.id);
          setRender(0);
          break; //
        case ROUTES.CHATS:
          getChats();
          setRouteBefore(ROUTES.CHATS);
          setRender(1);
          break;
        case ROUTES.FRIENDS:
          getFriendsProfiles();
          setRouteBefore(ROUTES.FRIENDS);
          setRender(2);
          break;
        default:
          break;
      }
    }
  }, [chat.open, chat.route]);

  // ///////////////////////////
  /**
   * HELPERS FOR THE COMPONENT
   */
  function onChange(e) {
    setText(e.target.value);
  }
  /**
   * @param {Number} Render, RenderComponent that you want
   * @returns {React.FunctionComponent}, JSX Component.
   */
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
  // handles back @@DEPRECATED FOR THE MOMENT
  function handleBack() {
    if (chat.route === ROUTES.CHATS) {
      return open();
    }
    if (chat.route === ROUTES.CHAT) {
      return setChatRoute(routeBefore);
    }
    if (chat.route === ROUTES.FRIENDS) {
      return open();
    }
    return null;
  }
  // handles the sendMessage action
  function sendMessageSubm() {
    setText('');
    sendMessage({
      message: text,
      to: chat.currentChatInfo.id,
      toUsername: chat.currentChatInfo.username,
      fromId: auth.id,
      username: auth.user,
    });
  }
  // handles enter on input.
  function onEnter(e) {
    const keyCode = e.keyCode || e.which;
    // enter keycode
    if (keyCode === 13) {
      sendMessageSubm();
    }
  }
  // handles the button click for changing routes.
  function handleFriends() {
    if (chat.route === ROUTES.CHAT) setChatRoute(routeBefore);
    else if (chat.route === ROUTES.CHATS) setChatRoute(ROUTES.FRIENDS);
    else setChatRoute(ROUTES.CHATS);
  }
  // returns the title for the button that changes routes.
  function handleFriendsTitle() {
    if (chat.route === ROUTES.CHATS) return ROUTES.FRIENDS;
    return ROUTES.CHATS;
  }
  /**
   * FRIEND LIST RENDERING
   */
  let friendList;
  if (chat.listOfFriends && chat.route === ROUTES.FRIENDS) {
    friendList = chat.listOfFriends;
  }
  /**
   * CHAT RENDERING
   */
  let messages;
  let loadingMessages;
  if (chat.chat && chat.chat.messages && chat.route === ROUTES.CHAT) {
    messages = chat.chat.messages;
    loadingMessages = chat.chat.tempMessages;
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
          style={{
            marginTop: '20px',
            width: '90%',
          }}
        />
      </div>
      <div className="col-md-2 mt-3">
        <IconButton onClick={sendMessageSubm} value="Send" color="primary">
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
  // actions for chat
  const actions =
    ROUTES.CHAT === chat.route ? actionChat : <div className="pt-3" />;
  // username for the chat
  const otherUser = chat.currentChatInfo ? chat.currentChatInfo.username : null;
  // profile image for chat
  const profileImg = chat.currentChatInfo
    ? chat.currentChatInfo.profileImage
    : null;
  return (
    <div>
      <DialogMe
        handleFriend={handleFriends}
        titleButton={
          chat.route === ROUTES.CHAT ? routeBefore : handleFriendsTitle()
        }
        Render={returnRightRender(render)}
        propsRender={{
          messages,
          loadingMessages,
          otherUser,
          username: auth ? auth.id : '',
          chats: chat.chats,
          setChatRoute,
          setChatInfo,
          // Friendlist
          friends: friendList,
          friendsConnected: chat.friendsConnected || {},
        }}
        isLoading={isLoading}
        renderActions={actions}
        title={ROUTES.CHAT === chat.route ? otherUser : ''}
        image={
          chat.route === ROUTES.CHAT && profileImg ? (
            <GoImage
              style={{
                height: '60px',
                width: '60px',
                borderColor:
                  chat.friendsConnected &&
                  chat.friendsConnected[chat.currentChatInfo.id]
                    ? '#2bff8e'
                    : 'grey',
                borderWidth: '3.3px',
              }}
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
        handleClose={open}
        handleBack={handleBack}
      />
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
    open,
    getChats,
    setChatRoute,
    setChatInfo,
    getFriendsProfiles,
  },
)(ChatDialog);
