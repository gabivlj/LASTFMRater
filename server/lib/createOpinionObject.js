const Opinion = require('../models/Opinions');

/**
 * @param {Array<any>} objects
 */
const createOpinionObject = async objects => {
  const promises = objects.map(object =>
    new Opinion({ objectId: object._id, likes: [], dislikes: [] }).save(),
  );
  const saved = await Promise.all(promises);
  return saved;
};

module.exports = createOpinionObject;
