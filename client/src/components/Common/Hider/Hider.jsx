import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import HiderButton from './HiderButton';

function Hider({ components, styles, ...props }) {
  const MAX_ELEMENT = components.length;
  const [currentElement, setCurrentElement] = useState(0);
  let Render;
  if (MAX_ELEMENT > 0) {
    if (currentElement >= components.length) {
      setCurrentElement(components.length - 1);
      Render = components[components.length - 1].Component;
    } else {
      Render = components[currentElement].Component;
    }
  }
  function selectButton(index) {
    return () => {
      setCurrentElement(index);
    };
  }
  const buttons = components.map((component, index) => (
    <HiderButton
      key={component.name}
      name={component.name}
      onClick={selectButton(index)}
      index={index}
      currentElement={currentElement}
    />
  ));
  return (
    <div className="hider" styles={styles} {...props}>
      <div className="row">{buttons}</div>
      <div className="render-hider">
        {components[currentElement] && components[currentElement].jsx ? (
          <Render {...components[currentElement].props} />
        ) : (
          Render
        )}
      </div>
    </div>
  );
}

Hider.propTypes = {
  components: PropTypes.arrayOf(
    PropTypes.shape({
      Component: PropTypes.element.isRequired,
      name: PropTypes.string.isRequired,
      selected: PropTypes.bool,
      jsx: PropTypes.bool,
      props: PropTypes.object,
    }),
  ).isRequired,
};

export default Hider;
