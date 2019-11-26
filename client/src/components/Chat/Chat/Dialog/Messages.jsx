/* eslint-disable prettier/prettier */
import React, { useRef, useEffect } from 'react';
import './message.style.css';

export default function Messages({ messages, otherUser, loadingMessages }) {
  const list = useRef(null);

  function scrollBottom() {
    if (list.current) {
      list.current.scrollIntoView({
        block: 'end',
        behaviour: 'smooth',
      });
    }
  }
  const classes = {
    padding: user => (user === otherUser ? '' : 'padding-l-100'),
    message: user =>
      user === otherUser ? 'speech-bubble-them' : 'speech-bubble-me',
    lastmsg: (user, index) =>
      index === messages.length - 1
        ? user === otherUser
          ? 'last-msg-them'
          : 'last-msg-me'
        : '',
    loadingMsg: () => 'speech-bubble-me-loading',
    margin: () => 'margin-top-speech',
  };
  useEffect(() => {
    scrollBottom();
  }, [messages, loadingMessages]);
  let messagesRender;
  let messagesRenderLoading;
  if (messages)
    messagesRender = messages.map((msg, index) => (
      <div
        key={msg._id || msg.provisionalId}
        className={classes.padding(msg.username)}
      >
        <div
          className={`${classes.message(msg.username)} ${classes.lastmsg(
            msg.username,
            index,
          )}`}
        >
          <p>{`${msg.text}`}</p>
        </div>
      </div>
    ));
  if (loadingMessages) {
    messagesRenderLoading = loadingMessages.map(msg => (
      <div
        key={msg._id || msg.provisionalId}
        className={`${classes.padding(msg.username)} ${classes.margin()}`}
      >
        <div className={`${classes.loadingMsg()}`}>{`${msg.text}   `}</div>
        <p>sending...</p>
      </div>
    ));
  }
  console.log(loadingMessages);
  return (
    <div>
      {messagesRender}
      {messagesRenderLoading}
      <div ref={list} />
    </div>
  );
}
