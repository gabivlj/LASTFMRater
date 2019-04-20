module.exports = fn => fn.then(res => [null, res]).catch(err => [err, null]);
