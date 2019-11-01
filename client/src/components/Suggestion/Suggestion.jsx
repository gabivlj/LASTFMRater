import React from 'react';
import SuggestionLikes from './Likes';
import SuggestionData from './SuggestionData';

function Suggestion({ suggestion, disabled }) {
  return (
    <div>
      <SuggestionData object={suggestion.data} />
      <SuggestionLikes objectID={suggestion._id} disabled={disabled} />
    </div>
  );
}

export default Suggestion;
