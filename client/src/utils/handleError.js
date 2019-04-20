/**
 * @param {@function Async}
 * @returns {Array: [data, error]}
 * @description Handles errors from API.
 */

export default fn => fn.then(data => [data, null]).catch(err => [null, err]);
