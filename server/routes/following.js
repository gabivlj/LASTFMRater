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
      const user = await User.findById(userId);
      const index = user.followedAccounts.indexOf(id);
      //
      if (index < 0) {
        // const followed = [...user.followedAccounts, id];
        // user.followedAccounts = followed;
        user.followedAccounts.push(id);
        dontCareWaitingForSave(user, false);
        const [err, theUserItsGonnaFollow] = await handleError(
          User.findById(id)
        );
        if (err) throw err;
        const newFollowers = [...theUserItsGonnaFollow.followers, userId];
        theUserItsGonnaFollow.followers = newFollowers;
        const [errAnotherTime, returnedUser] = await handleError(
          theUserItsGonnaFollow.save()
        );
        if (errAnotherTime) throw errAnotherTime;
        returnedUser.password = null;
        user.password = null;
        Activity.addSomethingActivity(
          Activity.createFollowedInformation(theUserItsGonnaFollow, user)
        );
        return res.json({ profile: returnedUser, me: user });
      }
      const followed = user.followedAccounts.filter(
        followed => String(followed) !== String(id)
      );
      user.followedAccounts = followed;
      dontCareWaitingForSave(user, false);
      const [err, theUserItsGonnaFollow] = await handleError(User.findById(id));
      if (err) throw err;
      // We filter it out because we know he wanna unfollow.
      const newFollowers = theUserItsGonnaFollow.followers.filter(
        follower => String(follower) !== String(userId)
      );
      theUserItsGonnaFollow.followers = newFollowers;
      const [errAnotherTime, saved] = await handleError(
        theUserItsGonnaFollow.save()
      );
      if (errAnotherTime) throw errAnotherTime;
      saved.password = null;
      user.password = null;
      return res.json({ profile: saved, me: user });
    } catch (err) {
      // console.log(err);
      return res.status(404).json({ error: 'Error un/following the user...' });
    }
  }
);

module.exports = router;
