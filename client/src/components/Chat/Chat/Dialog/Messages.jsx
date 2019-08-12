/* eslint-disable prettier/prettier */
import React, { useRef, useEffect } from 'react';
import uuid from 'uuid/v1';

export default function Messages({ messages }) {
  const list = useRef(null);
  function scrollBottom() {
    if (list.current) {
      list.current.scrollIntoView({
        block: 'end',
        behaviour: 'smooth'
      });
    }
  }
  useEffect(() => {
    scrollBottom();
  }, [messages]);
  return (
    <div style={{ overflow: 'auto' }}>
      {messages
        ? messages.map(msg => (
          <div key={msg._id || uuid()}>{`${msg.username}: ${msg.text}`}</div>
          ))
        : null}
      <div ref={list} />
    </div>
  );
}
