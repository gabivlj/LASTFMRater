/**
 * @description Returns err and response.
 * @returns [err, response]
 */
module.exports = fn => fn.then(res => [null, res]).catch(err => [err, null]);
