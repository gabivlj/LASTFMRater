/* eslint-disable no-param-reassign */
/**
 * @param {Array<any>} array,
 * @param {Function(Object): String}
 */
const zip = (array, key = now => now._id) =>
  array.reduce((prev, now) => {
    prev[String(key(now))] = now;
    return prev;
  }, {});

module.exports = zip;
