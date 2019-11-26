/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/**
 * @description Filter out one desired element.
 */
export default (array, fn) => {
  let arr;
  if (!Array.isArray(array)) {
    arr = Array.from(array);
  } else {
    arr = array;
  }
  const end = [];
  let filteredOne = false;
  for (let i = 0; i < arr.length; ++i) {
    if (!filteredOne && fn(arr[i], i)) {
      filteredOne = true;
      continue;
    }
    end.push(arr[i]);
  }
  return end;
};
