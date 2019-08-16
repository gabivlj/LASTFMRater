const handleError = require('../lib/handleError');
const ActivityModel = require('../models/Activity');

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

  async getActivityFromUsersFollowers(followingArray) {
    const followingOr = followingArray.map(following => ({ user: following }));
    const activity = await ActivityModel.find({ $or: followingOr }).sort({
      date: -1
    });
    return activity;
  }

  async addSomethingActivity({ information, type, user, userName }) {
    if (!this.checkActivityIsRight(type)) {
      throw new Error('Error, activity not defined in the activity vars.');
    }
    const activity = new ActivityModel({
      information,
      type,
      user,
      username: userName
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
        followed: { id: userFollowed._id, userName: userFollowed.username },
        follows: { id: userFollows._id, userName: userFollows.username }
      },
      type: this.ACTIVITIES.FOLLOWED_USER,
      user: userFollowed._id,
      userName: userFollowed.username
    };
  }

  createRatedInformation(
    { albumId, albumName, score, artist, mbid },
    { username, userId }
  ) {
    return {
      information: {
        albumId,
        albumName,
        score,
        artist,
        mbid
      },
      type: this.ACTIVITIES.ALBUM_RATING,
      userName: username,
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
        objectCommented,
        text
      },
      type: this.ACTIVITIES.COMMENT,
      userName: userCommented.username,
      user: userCommented._id
    };
  }
}

const ActivityInstance = new Activity();

module.exports = ActivityInstance;
