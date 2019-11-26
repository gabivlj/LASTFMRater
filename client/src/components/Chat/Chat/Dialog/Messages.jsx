/* eslint-disable prettier/prettier */
import React, { useRef, useEffect } from 'react';
import './message.style.css';
import { CircularProgress } from '@material-ui/core';

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
    lastmsg: (user, render) =>
      render === true
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
  let before;
  if (messages)
    messagesRender = messages.map((msg, index) => {
      let renderName = false;
      let renderArrow = false;
      if (index === messages.length - 1) renderArrow = true;
      else if (messages[index + 1].username !== msg.username)
        renderArrow = true;
      if (before !== msg.username) {
        renderName = true;
      }
      before = msg.username;
      return (
        <div
          key={msg._id || msg.provisionalId}
          className={classes.padding(msg.username)}
        >
          {renderName && (
            <span className="badge badge-primary">
              {msg.username === otherUser ? otherUser : 'You'}
            </span>
          )}
          <div
            className={`${classes.message(msg.username)} ${classes.lastmsg(
              msg.username,
              renderArrow,
            )}`}
          >
            <p>{`${msg.text}`}</p>
          </div>
        </div>
      );
    });
  if (loadingMessages) {
    messagesRenderLoading = loadingMessages.map(msg => (
      <div
        key={msg._id || msg.provisionalId}
        className={`message-loading ${classes.margin()}`}
      >
        <div className="row">
          <div className="col-2">
            <CircularProgress />
          </div>
          <div className="col-10">
            <div className={`${classes.loadingMsg()}`}>{msg.text}</div>
          </div>
        </div>
      </div>
    ));
  }
  return (
    <div>
      {messagesRender}
      {messagesRenderLoading}
      <div ref={list} />
    </div>
  );
}
