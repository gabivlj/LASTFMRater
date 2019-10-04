import React from 'react';
import ReactMarkdown from 'react-markdown';
import Stars from '../../Profile/Ratings/Stars';
import './reviewItem.style.css';

function ReviewItem({ text, username, puntuation }) {
  return (
    <div className="review-item">
      <div>
        <h3>{username}</h3>
      </div>
      <div>
        <ReactMarkdown source={text} skipHtml />
      </div>
      <div>
        <Stars puntuation={puntuation} generalScore={10} />
      </div>
    </div>
  );
}

export default ReviewItem;
