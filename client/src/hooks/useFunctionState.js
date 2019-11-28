import { useState } from 'react';

/**
 * @param {Function} fn, Function that you want as initial state.
 * @description Function that wraps useState hook to have functions as a state.
 * @reason Because useState updater calls the function that is passed and returns what that function should return, so it needs a wrap where we set an additional function before the function that we wanna call so it returns the 'real function'.
 * @returns {Array<Function, Function>} [RealFunction, SetFunction]. The current function that you wanna call, and seter of that function.
 * @summary https://github.com/facebook/react/issues/14087#issuecomment-435582287
 */
export default function useFunctionState(fn) {
  const [func, setFunction] = useState(() => fn);
  function wrapFunction(fn) {
    // Wraps the function, see @reason.
    setFunction(() => fn);
  }

  return [func, wrapFunction];
}
