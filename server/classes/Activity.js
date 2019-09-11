const handleError = require('../lib/handleError');
const ActivityModel = require('../models/Activity');
const User = require('../models/User');
const time = require('../lib/time');

class Activity {
  constructor() {
    this.ACTIVITIES = {
      ALBUM_RATING: 'ALBUM_RATING',
      PLAYLIST_RATING: 'PLAYLIST_RATING',
      COMMENT: 'COMMENT',
      CREATED_PLAYLIST: 'CREATED_PLAYLIST',
      FOLLOWED_USER: 'FOLLOWED_USER',
    };
    this.ALBUM_RATING = 'ALBUM_RATING';

    this.PLAYLIST_RATING = 'PLAYLIST_RATING';
    this.COMMENT = 'COMMENT';
    this.CREATED_PLAYLIST = 'CREATED_PLAYLIST';
    this.FOLLOWED_USER = 'FOLLOWED_USER';
  }

  async addAlbumRatingActivity(
    { albumName, id, mbid = '', artistName },
    user,
    userId,
  ) {
    const activity = new ActivityModel({
      user: userId,
      username: user,
      type: 'album_rating',
      information: {
        albumName,
        id,
        mbid,
        artistName,
      },
    });
    const activityReturn = await activity.save();
    return activityReturn;
  }

  async getActivityFromUsersFollowers(followingArray, beginning = 0, end = 4) {
    // $or array
    const following = followingArray.map(follow => ({ user: follow }));
    const activity = await ActivityModel.aggregate([
      {
        $match: {
          $or: following,
        },
      },
      {
        // join users with activity
        $lookup: {
          from: 'users',
          localField: 'username',
          foreignField: 'username',
          as: 'userObj',
        },
      },
      {
        $project: {
          user: 1,
          username: 1,
          type: 1,
          information: 1,
          date: 1,
          images: { $arrayElemAt: ['$userObj.images', 0] },
          // secondxyzArray: { $arrayElemAt: ['$xyzArray', 1] }
        },
      },
    ])
      .sort({ date: -1 })
      .limit(beginning + end + 1);
    const finalActivity = activity.slice(beginning, end + 1);
    return finalActivity;
  }

  /**
   * @description call this function and it will handle if the activity is repeated
   * @returns {Boolean} False if you shouldn't save activity, otherwise if you should
   */
  async dontDoRepeatedActivity(type, information, user, username) {
    let doAct = true;
    let act;
    try {
      switch (type) {
        case this.ACTIVITIES.ALBUM_RATING:
          act = await ActivityModel.updateOne(
            {
              'information.objId': information.objId,
            },
            { type, information, user, username },
          );
          if (!act || act.nModified === parseInt(0, 10)) doAct = true;
          else {
            // act.update({ type, information, user, username });
            doAct = false;
          }
          return doAct;
        case this.ACTIVITIES.FOLLOWED_USER:
          console.log(information);
          doAct = await ActivityModel.findOne({
            user,
            username,
            type,
            'information.followed.username': information.followed.username,
          });
          return !doAct;
        default:
          return doAct;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async addSomethingActivity({ information, type, user, username, image }) {
    if (!this.checkActivityIsRight(type)) {
      throw new Error('Error, activity not defined in the activity vars.');
    }
    const doActivity = await this.dontDoRepeatedActivity(
      type,
      information,
      user,
      username,
    );
    if (!doActivity) return null;
    const activity = new ActivityModel({
      information,
      type,
      user,
      username,
      date: Date.now(),
    });
    const [err, activitySave] = await handleError(activity.save());
    console.log(activitySave);
    if (err) {
      console.log(err);
      throw err;
    }
    return activitySave;
  }

  checkActivityIsRight(activity) {
    return !!this.ACTIVITIES[activity];
  }

  createFollowedInformation(userFollowed, userFollows, pathname) {
    return {
      information: {
        followed: { id: userFollowed._id, username: userFollowed.username },
        follows: { id: userFollows._id, username: userFollows.username },
        pathname: null,
      },
      type: this.ACTIVITIES.FOLLOWED_USER,
      user: userFollows._id,
      username: userFollows.username,
    };
  }

  createRatedInformation(
    { _id, name, score, creator, mbid, pathname },
    { username, userId },
  ) {
    return {
      information: {
        creator,
        score,
        pathname,
        name,
        mbid,
        objId: _id,
      },
      type: this.ACTIVITIES.ALBUM_RATING,
      username,
      user: userId,
    };
  }

  createCommentedInformation(
    userCommented,
    text,
    objectCommented,
    answered = null,
  ) {
    return {
      information: {
        ...objectCommented, // name, _id, route
        text,
        answered,
      },
      type: this.ACTIVITIES.COMMENT,
      username: userCommented.username,
      user: userCommented._id,
    };
  }
}

const ActivityInstance = new Activity();

module.exports = ActivityInstance;

// thrash code
// Create the $or following arrays.
// const following = followingArray.reduce(
//   (prev, current) => [
//     [...prev[0], { _id: current }],
//     [...prev[1], { user: current }]
//   ],
//   [[], []]
// );
// find activities promise
// const activity = ActivityModel.find({ $or: following[1] }).sort({
//   date: -1
// });
// console.log(test);
// // use the first one to find the users.
// const users = await User.find({ $or: following[0] });
// // reduce for dictionary
// const imageDictionary = users.reduce(
//   (prev, current) => ({ ...prev, [current._id]: current.images }),
//   {}
// );

// // wait promise
// const [promisedActivity] = await Promise.all([activity]);
// const finalActivity = promisedActivity.map(act => ({
//   user: act.user,
//   username: act.username,
//   type: act.type,
//   information: act.information,
//   date: act.date,
//   image: imageDictionary[act.user],
//   _id: act._id
// }));
