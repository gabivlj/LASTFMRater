import React from 'react';
import Suggestion from '../Common/Suggestion';

function ArtistSuggestions({ artist }) {
  console.log(artist.pendingChanges);
  return (
    <div>
      <h1>Suggestions</h1>
      {artist.pendingChanges.map(p => (
        <Suggestion
          tag={p.typeOfChange}
          data={p.data[p.typeOfChange]}
          key={p._id}
        />
      ))}
    </div>
  );
}

export default ArtistSuggestions;
