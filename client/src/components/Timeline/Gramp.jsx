import React from 'react';
import './gramp.styles.css';

function Gramp({ gramp }) {
  const { username, user, type, date, information, _id } = gramp || {};
  const { pathname, name, text, score } = information || {};

  return (
    <div className="gramp">
      <div className="gramp-upper">
        <h2>{username}</h2>
      </div>
      <div className="gramp-body">{name}</div>
    </div>
  );
}

export default Gramp;
