const handleError = require('./handleError');

/**
 * @param {Model},  The instance that you wanna save.
 * @param {Boolean}, If you also don't care about the error, pass false, but it's not recommended.
 * @description When you just don't care about the return value and waiting for it.
 * @returns {SavedInstance} || {Error}
 */
module.exports = async function dontCareWaitingForSave(
  instance,
  careAboutError = true,
) {
  const [err, _] = await handleError(instance.save());
  if (err && careAboutError) throw err;
  if (err && !careAboutError) return err;
  // console.log(_);
  return _;
};
