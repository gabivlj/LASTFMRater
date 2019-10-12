/**
 * @param {Array<any>} arr, Array you wanna delete from
 * @param {Number} index
 * @description Returns a copy of an array that has the specified index deleted.
 */
const remove = (arr, index) =>
  index >= arr.length ? arr : [...arr.slice(0, index), ...arr.slice(index + 1)];

module.exports = remove;
