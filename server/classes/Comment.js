const handleError = require('../lib/handleError');
const Comment = require('./CommentSchema');
const albumHelper = require('./Album');

function addOpinionToComment(userId, comment, type) {
  comment[type].map(opinions => String(opinions.user)).indexOf(String(userId));
}

/**
 * @param {Array} comments, Comments array.
 * @param {String} id, Id to find
 * @param {Callback} fn, What do you wanna do to that comment.
 */
function findComment(comments, id, fn) {
  for (const comment of comments) {
    if (String(comment._id) === String(id)) {
      fn(comment);
      break;
    }
  }
}

function addOpinion(comment) {}

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
        reject(err);
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
      // Check if we can do fast indexing.
      function checkFastIndex() {
        return (
          typeof fastIndex === 'number' &&
          SchemaInstance.comments.length > fastIndex &&
          fastIndex >= 0 &&
          String(SchemaInstance.comments[fastIndex]._id) === String(commentId)
        );
        // Do fastIndex
      }
      try {
        if (checkFastIndex()) {
          SchemaInstance.comments[fastIndex][type].push({
            user: userGivingOpinion,
          });
          finalIndex = fastIndex;
        } else {
          findComment(SchemaInstance.comments, commentId);
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
