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
      FOLLOWED_USER: 'FOLLOWED_USER'
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
    userId
  ) {
    const activity = new ActivityModel({
      user: userId,
      username: user,
      type: 'album_rating',
      information: {
        albumName,
        id,
        mbid,
        artistName
      }
    });
    const activityReturn = await activity.save();
    return activityReturn;
  }

  async getActivityFromUsersFollowers(followingArray) {
    // Create the $or following arrays.
    const following = followingArray.reduce(
      (prev, current) => [
        [...prev[0], { _id: current }],
        [...prev[1], { user: current }]
      ],
      [[], []]
    );
    // find activities promise
    const activity = ActivityModel.find({ $or: following[1] }).sort({
      date: -1
    });
    // use the first one to find the users.
    const users = await User.find({ $or: following[0] });
    // reduce for dictionary
    const imageDictionary = users.reduce(
      (prev, current) => ({ ...prev, [current._id]: current.images }),
      {}
    );

    // wait promise
    const [promisedActivity] = await Promise.all([activity]);
    const finalActivity = promisedActivity.map(act => ({
      user: act.user,
      username: act.username,
      type: act.type,
      information: act.information,
      date: act.date,
      image: imageDictionary[act.user]
    }));
    return finalActivity;
  }

  /**
   * @description call this function and it will handle if the activity is repeated
   * @returns {Boolean} False if you shouldn't save activity, otherwise if you should
   */
  async dontDoRepeatedActivity(type, information, user, username) {
    let doAct = true;
    switch (type) {
      case this.ACTIVITIES.ALBUM_RATING:
        doAct = await ActivityModel.findOneAndUpdate(
          {
            type,
            information: { albumId: information.albumId },
            user,
            username
          },
          {
            type,
            information,
            user,
            username
          }
        );
        return !!doAct;
      case this.ACTIVITIES.FOLLOWED_USER:
        doAct = !!(await ActivityModel.findOne({
          user,
          username,
          type,
          information
        }));
        return doAct;
      default:
        return doAct;
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
      username
    );
    if (!doActivity) return null;
    const activity = new ActivityModel({
      information,
      type,
      user,
      username
    });
    const [err, activitySave] = await handleError(activity.save());
    if (err) throw err;
    return activitySave;
  }

  checkActivityIsRight(activity) {
    return !!this.ACTIVITIES[activity];
  }

  createFollowedInformation(userFollowed, userFollows) {
    return {
      information: {
        followed: { id: userFollowed._id, username: userFollowed.username },
        follows: { id: userFollows._id, username: userFollows.username }
      },
      type: this.ACTIVITIES.FOLLOWED_USER,
      user: userFollowed._id,
      username: userFollowed.username
    };
  }

  createRatedInformation(
    { albumId, albumName, score, artist, mbid, pathname },
    { username, userId }
  ) {
    return {
      information: {
        albumId,
        albumName,
        score,
        artist,
        mbid,
        pathname
      },
      type: this.ACTIVITIES.ALBUM_RATING,
      username,
      user: userId
    };
  }

  createCommentedInformation(
    userCommented,
    text,
    objectCommented,
    answered = null
  ) {
    return {
      information: {
        objectCommented, // name, _id, route
        text,
        answered
      },
      type: this.ACTIVITIES.COMMENT,
      username: userCommented.username,
      user: userCommented._id
    };
  }
}

const ActivityInstance = new Activity();

module.exports = ActivityInstance;
