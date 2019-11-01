/**
 * @description Returns an array with all the keys that are deep within an object
 *              For example: { a: 'a', b: { c: 'a' }} will return [{type: 'a', data: 'a',}, {type:'c', data: 'a'}]
 * @param {Object} obj
 */
function deepKeysToArray(obj) {
  const arr = [];
  function recursive(object) {
    const keys = Object.keys(object);
    keys.forEach(key => {
      if (typeof object[key] !== 'object') {
        arr.push({ type: key, data: object[key] });
      } else {
        recursive(object[key]);
      }
    });
  }
  recursive(obj);
  return arr;
}

export default deepKeysToArray;
