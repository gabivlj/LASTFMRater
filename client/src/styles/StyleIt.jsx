/**
 * @createdBy Gabriel Villalonga @gabivlj
 * @description Minilibrary so we can pass styles and themes to components with StyleIt()
 *              Also we can set themes dynamically in a global state.
 */

import React, { useState, useEffect } from 'react';
import guidGenerator from '../utils/idCreator';

// GLOBAL STATE OF VALUES
let __VALUES = {
  theme: {},
};

// GLOBAL STATE OF STYLES
let __STYLES = _ => {
  return {};
};

// Indicate if styles have been initialized
let initializedStyles = false;

// Components subscribed to the theme.
let update = [];

// Update every subsriber
const updateSubscribers = () => {
  update.forEach(s => s.cb());
};

/**
 *
 * @param {Function} cb, Callback that will be executed when some component updates the theme. This callback should be
 * the function that contains a setState that updates the StyleIt returned component.
 * @returns {Function} unsubscribe, Unsubscribes when called.
 */
const subscribe = cb => {
  const id = guidGenerator();
  update.push({ cb, id });
  return () => {
    update = update.filter(u => u.id !== id);
  };
};

/**
 * @param {any} style,
 * @description Not implemented. But should update the style of the global style state.
 */
export const Style = style => {
  __STYLES = {
    ...__STYLES,
    ...style,
  };
  updateSubscribers();
};

/**
 * @param {Function(theme)} Callback, Returns what should be the new theme.
 * @description Updates the theme, take in mind that every component that is currently rendering will be updated.
 */
export const SetThemeVariables = Callback => {
  __VALUES = { theme: Callback(__VALUES.theme, __STYLES) };
  updateSubscribers();
  if (__VALUES == null) {
    console.error('ERROR, values of theme are not correct.');
  }
};

/**
 *
 * @param {Array<String>} what, Array of attributes that will be mounted on objectConstruction
 */
const GetStyle = what => {
  const objectContruction = {};
  what.forEach(w => {
    objectContruction[w] = __STYLES(__VALUES.theme)[w];
  });
  return objectContruction;
};

/**
 * @description Pass here the initial state of the styles and theme.
 */
export const StyleJSX = ({ theme, style, children }) => {
  // Check if we already initialized the theme so we don't reinitialize it, just incase.
  if (!initializedStyles) {
    __VALUES.theme = theme;
    __STYLES = style;
    initializedStyles = true;
  }
  return children;
};

export const mountStyles = styles => {
  return theme => ({
    ...styles.reduce((prev, now) => ({ ...prev, ...now(theme) }), {}),
  });
};

/**
 * @param {ReactComponent} Component
 * @param {Array<String>} what, the style components that you're interested in.
 * @description Call this so you have this component subscribed to the theme and passed as props styles
 * @returns {import('react').JSXElementConstructor}
 */
export const StyleIt = (Component, what) => {
  return function({ ...props }) {
    // Create useState function so we can subscribe.
    const [_, s] = useState(false);
    // Use effect so everytime theme is updated styles of every componente updates.
    useEffect(() => {
      // Pass the callback to the subscribe function so it can execute the useState function to
      // update this component.
      const unsubscribe = subscribe(() => s(prev => !prev));
      return () => {
        unsubscribe();
      };
    }, [_]);
    // Pass the styles depending on what the caller wants.
    return <Component {...props} styles={GetStyle(what)} />;
  };
};
