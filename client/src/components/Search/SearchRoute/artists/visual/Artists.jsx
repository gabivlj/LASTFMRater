import React from 'react';
import Artist from './Artist';

export default function Artists({ artists }) {
  return (
    <div className="row">
      {' '}
      {artists.map((artist, index) => (
        <Artist className="col-md-4 m-3" key={index} artist={artist} />
      ))}
    </div>
  );
}
