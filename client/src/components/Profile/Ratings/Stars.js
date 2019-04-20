import React, { useState, useEffect } from 'react'

const buttonStyle = {
  textDecoration: 'none',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
};

export default function Stars({ puntuation, generalScore}) {
  let stars = []  
  for (let i = 0; i < generalScore; i++) {
    if (i >= puntuation) {
      stars.push(<i className="far fa-star" id={i} key={i} style={{ color: '#b29600' }} />);
    } else {
      stars.push(<i className="fas fa-star" id={i} key={i} style={{ color: '#FFD700' }} />);      
    }
  }  
  return (
    <div>{stars}</div>
  )
}
