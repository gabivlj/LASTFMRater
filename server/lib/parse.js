/**
 * @param {String}, data
 * @description Parses JSON string, if it's not a JSON object, returns the original data. Useful if you don't know if it's gonna come an object or a string or a number.
 * @returns {String || Object}
 */

const parse = data => {
  try {
    return JSON.parse(data);
  } catch (_) {
    return data;
  }
};

module.exports = parse;
