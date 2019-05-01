const handleError = require('./handleError');

module.exports = class RatingHelper {
  constructor(SchemaModel) {
    this.SchemaModel = SchemaModel;
  }

  /**
   *
   * @param {String} user, The user id.
   * @param {String} modelId, The model id.
   * @param {Number} rating, The puntuation of the rating.
   * @param {SchemaModel?} SchemaModel?, optional, The Model to find.
   */
  addRating(user, modelId, rating, SchemaModel = this.SchemaModel) {
    return new Promise(async (resolve, reject) => {
      const [error, model] = await handleError(
        SchemaModel.findOne({ _id: modelId })
      );
      if (error) {
        console.log(error);
        return reject(new Error('Error adding the rating.'));
      }
      const indexOfUser = model.ratings
        .map(eachRating => String(eachRating.user))
        .indexOf(String(user));
      const ratingToAdd = {
        user,
        puntuation: rating,
      };
      if (indexOfUser > -1) {
        model.ratings.splice(indexOfUser, 1, ratingToAdd);
        return resolve(model);
      }
      model.ratings.push(ratingToAdd);
      return resolve(model);
    });
  }
};
