/* eslint-disable prettier/prettier */
import React, { useRef, useEffect } from 'react';
import uuid from 'uuid/v1';
import './message.style.css';

export default function Messages({ messages, otherUser }) {
  const list = useRef(null);

  function scrollBottom() {
    if (list.current) {
      list.current.scrollIntoView({
        block: 'end',
        behaviour: 'smooth'
      });
    }
  }
  const classes = {
    padding: user => (user === otherUser ? '' : 'padding-l-100'),
    message: user =>
      user === otherUser ? 'speech-bubble-them' : 'speech-bubble-me',
    lastmsg: index => (index === messages.length - 1 ? 'last-msg' : '')
  };
  useEffect(() => {
    scrollBottom();
  }, [messages]);
  let messagesRender;
  if (messages)
    messagesRender = messages.map((msg, index) => (
      <div key={msg._id || uuid()} className={classes.padding(msg.username)}>
        <div
          className={`${classes.message(msg.username)} ${classes.lastmsg(
            index
          )}`}
        >
          {`${msg.text}`}
        </div>
      </div>
    ));
  return (
    <div>
      {messagesRender}
      <div ref={list} />
    </div>
  );
}
