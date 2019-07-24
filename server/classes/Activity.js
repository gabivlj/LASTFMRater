import handleError from '../../client/src/utils/handleError';

const ActivityModel = require('../models/Activity');

export const ALBUM_RATING = 'ALBUM_RATING';
export const PLAYLIST_RATING = 'PLAYLIST_RATING';
export const COMMENT = 'COMMENT';
export const CREATED_PLAYLIST = 'CREATED_PLAYLIST';

const checkActivityIsRight = activity =>
  activity === ALBUM_RATING ||
  activity === PLAYLIST_RATING ||
  COMMENT === activity ||
  CREATED_PLAYLIST === activity;

class Activity {
  static async addAlbumRatingActivity(
    { albumName, id, mbid = '', artistName },
    user,
    userId
  ) {
    const activity = new ActivityModel({
      user: userId,
      userName: user,
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

  static async getActivityFromUsersFollowers(followingArray) {
    const followingOr = followingArray.map(following => ({ user: following }));
    const activity = await ActivityModel.find({ $or: followingOr }).sort({
      date: -1
    });
    return activity;
  }

  static async addSomethingActivity(information, type, user, userName) {
    if (!checkActivityIsRight(type)) {
      throw new Error('Error, activity not defined in the activity vars.');
    }
    const activity = new ActivityModel({ information, type, user, userName });
    const [activitySave, err] = await handleError(activity.save());
    if (err) throw err;
    return activitySave;
  }
}

module.exports = Activity;
