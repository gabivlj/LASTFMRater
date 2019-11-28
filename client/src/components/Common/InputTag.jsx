import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Function(newElements, error?, deleteTagFunction(indexToDelete))} onAdd, When a tag is added, this is fired.
 * @param {Function(newElements)} deleteTag,
 * @param {number} limitWordLen, Maximum length of characters.
 * @param {String} buttonText, The button text
 * @param {String} defaultValue, Default value of input
 * @param {String} colorDefault, Color of default text
 * @param {String} colorInputText, Color of input text
 * @param {CSSStyleSheet} styleButton, Style of the button
 * @param {CSSStyleSheet} styleInput, Style of the input
 * @description InputTag with max. custom. In onAdd method it's passed the newElements, if there is an error, and the onDelete method where it should be called passing the index of the tag that you wanna delete, you can generate code PRETTY quickly with this, have a lot of custom. and still be able to see what tags are inside the state.
 */
function InputTag({
  onAdd,
  onDelete,
  buttonText,
  defaultValue,
  colorDefault,
  colorInputText,
  limitWordLen,
  styleButton,
  styleInput,
}) {
  // State
  const [startedTyping, setStartedTyping] = useState(false);
  const [elements, addElement] = useState([]);
  const [currentString, onChangeInput] = useState(defaultValue);

  // Methods
  function deleteTag(index) {
    addElement(e => {
      console.log(e);
      const d = e.filter((_, i) => index !== i);
      onDelete(d);
      return d;
    });
  }

  function onSubmit(_) {
    if (!startedTyping) {
      onAdd(elements, 'Error: Empty Input.', deleteTag);
      return elements;
    }

    addElement(elements => {
      const elementsReturn = [...elements, currentString];
      onAdd(elementsReturn, null, deleteTag);
      return elementsReturn;
    });
    onChangeInput(defaultValue);
    setStartedTyping(false);
    return elements;
  }

  return (
    <>
      <input
        style={{
          ...styleInput,
          color: startedTyping ? colorInputText : colorDefault,
        }}
        value={currentString}
        onKeyDown={e =>
          !startedTyping
            ? (e.keyCode === 8 || e.key === 'Backspace') &&
              onChangeInput('') &&
              startedTyping(true)
            : e.key === 'Enter' && onSubmit(e)
        }
        onChange={e => {
          if (e.target.value.length >= limitWordLen)
            return onChangeInput(e.target.value.slice(0, limitWordLen));
          if (!startedTyping) {
            setStartedTyping(true);
            return onChangeInput(
              e.target.value.slice(e.target.value.length - 1),
            );
          }
          if (e.target.value.trim() === '') {
            setStartedTyping(false);
            return onChangeInput(defaultValue);
          }
          return onChangeInput(e.target.value);
        }}
      />
      <button type="button" onClick={onSubmit} style={styleButton}>
        {buttonText}
      </button>
    </>
  );
}

InputTag.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  colorDefault: PropTypes.string,
  colorInputText: PropTypes.string,
  buttonText: PropTypes.string,
  defaultValue: PropTypes.string,
  limitWordLen: PropTypes.number,
  styleButton: PropTypes.shape(CSSStyleSheet),
  styleInput: PropTypes.shape(CSSStyleSheet),
};

InputTag.defaultProps = {
  limitWordLen: Infinity,
  defaultValue: '',
  buttonText: 'Submit',
  colorDefault: 'grey',
  colorInputText: 'black',
  styleButton: {},
  styleInput: {},
};

export default InputTag;
