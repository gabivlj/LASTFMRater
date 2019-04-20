import React from 'react'
import Stars from './Stars';

export default function Rating({ rating, generalScore, artistName, albumName }) {
  return (
    <div>
      <div className="row">
        <div className="col-md-4">
          {albumName} by {artistName}
        </div>
        <div className="col-md-8">
          <Stars 
            generalScore={generalScore} 
            puntuation={rating}
          />
          {rating} / {generalScore}
        </div>
      </div>
    </div>
  )
}
