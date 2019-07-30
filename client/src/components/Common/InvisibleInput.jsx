import React from 'react';
import PropTypes from 'prop-types';

function InvisibleInput({ text, onChange, editable, name }) {
  return (
    <div
      name={name}
      contentEditable={editable}
      onInput={onChange}
      suppressContentEditableWarning
    >
      {text}
    </div>
  );
}

InvisibleInput.propTypes = {};

export default InvisibleInput;
