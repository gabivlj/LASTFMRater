/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { StyleIt, SetThemeVariables } from '../../styles/StyleIt';
import InputTag from '../Common/InputTag';
import useFunctionState from '../../hooks/useFunctionState';

/**
 * @description Where I test every component that I make.
 * @right_now Showcase of InputTag and how it works...
 */
const Test = () => {
  const [tags, setTags] = useState([]);
  const [tagDeleteFunction, setTagFunction] = useFunctionState(() => {});
  function add(arr, err, tagFunc) {
    if (err) return;
    setTags(arr);
    setTagFunction(index => tagFunc(index));
  }
  const onDelete = newArray => setTags(newArray);
  return (
    <div>
      <InputTag
        styleInput={{ height: '200px', fontSize: '30px' }}
        onAdd={add}
        onDelete={onDelete}
        defaultValue="xd"
        styleButton={{ color: 'red' }}
        limitWordLen={10}
      />
      {tags.map((tag, index) => (
        <div key={tag} onClick={() => tagDeleteFunction(index)}>
          {tag}
        </div>
      ))}
    </div>
  );
};

export default StyleIt(Test, ['button']);
