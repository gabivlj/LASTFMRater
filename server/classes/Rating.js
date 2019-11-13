const numberReviewsDay = require('../lib/numberReviewsDay');
const Activity = require('./Activity');
const Chart = require('./Chart');

/**
 * @description Rating class tries to maintain a only way to add ratings to models in the application.
 * @todo Find user's rating method.
 */
class Rating {
  static async addRating(
    Model,
    _id,
    { puntuation, powerLevel },
    user,
    activityInformationCallback,
  ) {
    try {
      const model = await Model.findOne({
        _id,
      });
      if (!model) {
        return null;
      }
      const index = model.ratings
        .map(rating => rating.user)
        .indexOf(user.username);
      // If rating does not exist.
      if (index <= -1) {
        // Add it.
        model.ratings.push({
          puntuation,
          // Username.
          user: user.username,
          powerLevel,
        });
        // Add to "today" the rating. (This is because in another calls to the api
        // we may want to know the most hot rated albums of the day)
        model.numberOfReviewsEachDay = model.numberOfReviewsEachDay
          ? numberReviewsDay.add(model.numberOfReviewsEachDay)
          : [{ date: Date.now(), sum: 0 }];
      } else {
        // else replace
        model.ratings.splice(index, 1, {
          puntuation,
          user: user.username,
          powerLevel,
        });
        // // Substract from the last day that the album received a rating.
        // album.numberOfReviewsEachDay = album.numberOfReviewsEachDay
        //   ? numberReviewsDay.substract(album.numberOfReviewsEachDay)
        //   : [{ date: Date.now(), sum: 0 }];
      }
      const indexUser = user.ratedAlbums.indexOf(_id);
      if (indexUser <= -1) user.ratedAlbums.push(_id);
      user.save();
      model.save();
      Activity.addSomethingActivity(
        Activity.createRatedInformation(
          // {
          //   _id: album._id,
          //   name: `${album.name} by ${album.artist}`,
          //   score: req.body.puntuation,
          //   pathname: `/album/${album.artist}/${album.name}/${album.mbid}`,
          // },
          activityInformationCallback(model),
          { userId: user._id, username: user.username },
        ),
      );
      const average = Chart.averageWithPowerLevel(model.ratings);
      const endModel = {
        userScore: puntuation,
        score: average,
        __v: model.__v + 1,
        _id: model._id,
      };

      return endModel;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async deleteRating(Model, modelID, user) {
    try {
      const model = await Model.findById(modelID);
      if (!model) {
        return null;
      }
      model.ratings = model.ratings.filter(
        rating => String(rating.user) !== user.username,
      );
      const modelSaved = await model.save();
      user.ratedAlbums = user.ratedAlbums.filter(
        model => String(model) !== modelID,
      );
      user.save();
      const average = Chart.averageWithPowerLevel(model.ratings);
      modelSaved.score = average;
      return model;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = Rating;
