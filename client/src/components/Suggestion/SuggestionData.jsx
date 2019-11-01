import React from 'react';
import deepKeysToArray from '../../utils/deepKeysToArray';
import SuggestionObject from './SuggestionObject';

export default function SuggestionData(object) {
  const display = deepKeysToArray(object);
  return (
    <div>
      {display.map(d => (
        <SuggestionObject key={d.type} tag={d.type} data={d.data} />
      ))}
    </div>
  );
}
