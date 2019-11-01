import React from 'react';

function SuggestionObject({ tag, data }) {
  return <div>{`${tag}: ${data}`}</div>;
}

export default SuggestionObject;
