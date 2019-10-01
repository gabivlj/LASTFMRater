const router = require('express').Router();
const passport = require('passport');

const Activity = require('../classes/Activity');
const User = require('../models/User');
const dontCareWaitingForSave = require('../lib/dontCareWaitingForSave');
const handleError = require('../lib/handleError');

/**
 * @POST
 * @PRIVATE
 * @description Follows (or unfollows) the user that is passed in the route's id.
 */
router.post(
  '/follow/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { user } = req;
      const index = user.followedAccounts.indexOf(id);
      //
      if (!user.followedObject) user.followedObject = {};
      if (!user.followersObject) user.followersObject = {};
      if (index < 0) {
        // const followed = [...user.followedAccounts, id];
        // user.followedAccounts = followed;
        user.followedAccounts.push(id);
        user.followedObject[id] = id;
        dontCareWaitingForSave(user, false);
        const [err, theUserItsGonnaFollow] = await handleError(
          User.findById(id),
        );
        if (err) throw err;
        // todo: The dictionary is deprecated. Delete!
        if (!theUserItsGonnaFollow.followedObject)
          theUserItsGonnaFollow.followedObject = {};
        if (!theUserItsGonnaFollow.followersObject)
          theUserItsGonnaFollow.followersObject = {};
        const newFollowers = [...theUserItsGonnaFollow.followers, userId];
        theUserItsGonnaFollow.followers = newFollowers;
        theUserItsGonnaFollow.followersObject[userId] = userId;
        // ...
        dontCareWaitingForSave(theUserItsGonnaFollow, false);
        user.password = null;
        Activity.addSomethingActivity(
          Activity.createFollowedInformation(theUserItsGonnaFollow, user),
        );

        const followsUser = !!theUserItsGonnaFollow.followedObject[
          String(userId)
        ];
        return res.json({
          followed: true,
          followers: newFollowers,
          followsUser,
        });
      }
      const followed = user.followedAccounts.filter(
        followed => String(followed) !== String(id),
      );
      user.followedObject[String(id)] = null;
      user.followedAccounts = followed;
      dontCareWaitingForSave(user, false);
      const [err, theUserItsGonnaFollow] = await handleError(User.findById(id));

      if (err) throw err;
      if (!theUserItsGonnaFollow.followedObject)
        theUserItsGonnaFollow.followedObject = {};
      if (!theUserItsGonnaFollow.followersObject)
        theUserItsGonnaFollow.followersObject = {};
      // We filter it out because we know he wanna unfollow.
      const newFollowers = theUserItsGonnaFollow.followers.filter(
        follower => String(follower) !== String(userId),
      );
      theUserItsGonnaFollow.followersObject[userId] = null;

      theUserItsGonnaFollow.followers = newFollowers;
      dontCareWaitingForSave(theUserItsGonnaFollow, false);
      const followsUser = !!theUserItsGonnaFollow.followedObject[
        String(userId)
      ];
      user.password = null;
      return res.json({
        followed: false,
        followers: newFollowers,
        followsUser,
      });
    } catch (err) {
      console.log(err);
      return res.status(404).json({ error: 'Error un/following the user...' });
    }
  },
);

module.exports = router;
