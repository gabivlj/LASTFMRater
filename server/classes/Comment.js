const handleError = require('../lib/handleError');
const Comment = require('./CommentSchema');
const albumHelper = require('./Album');

function addOpinionToComment(userId, comment, type) {
  comment[type].map(opinions => String(opinions.user)).indexOf(String(userId));
}

function areParamsRight(model, comment) {
  if (!model || !comment) return false;
  return true;
}

/**
 * @description Handles all the comment adding, deleting, and like related stuff.
 */
class CommentHandler {
  /**
   * @param {SchemaInstance} model
   * @param {Comment} comment
   * @returns {Promise} comments
   */
  static postComment(modelInstance, comment) {
    return new Promise(async (resolve, reject) => {
      if (!areParamsRight(modelInstance, comment)) {
        return reject(new Error('Please pass all the params right'));
      }
      try {
        modelInstance.comments = [comment, ...modelInstance.comments];
        await modelInstance.save();
        const returner = modelInstance;
        returner.comments = albumHelper.mapLikesDislikes(returner.comments);
        return resolve(returner.comments);
      } catch (err) {
        return reject(err);
      }
    });
  }

  /**
   * @param {SchemaInstance} SchemaInstance
   * @param {Array} comments
   * @param {String} type, For the moment, likes or dislikes string shall be passed to this.
   * @param {String} commentId
   * @param {Number} fastIndex
   * @param {StringId} userGivingOpinion
   * @returns {Object} { whatTypeOfOpinionYouPassed: numberOfPeopleInThatOpinion }
   */
  static addOpinionToComment(
    SchemaInstance,
    type,
    commentId,
    fastIndex,
    userGivingOpinion
  ) {
    return new Promise(async (resolve, reject) => {
      let finalIndex = -1;
      function checkFastIndex() {
        return (
          typeof fastIndex === 'number' &&
          SchemaInstance.comments.length > fastIndex &&
          fastIndex >= 0 &&
          String(SchemaInstance.comments[fastIndex]._id) === String(commentId)
        );
      }
      try {
        if (checkFastIndex()) {
          SchemaInstance.comments[fastIndex][type].push({
            user: userGivingOpinion,
          });
          finalIndex = fastIndex;
        }
        await SchemaInstance.save();
        return resolve({
          [type]: SchemaInstance.comments[finalIndex][type].length,
        });
      } catch (err) {
        console.log(err);
        return reject(err);
      }
    });
  }
}

module.exports = CommentHandler;
