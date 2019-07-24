const router = require('express').Router();
const passport = require('passport');

const User = require('../models/User');
const dontCareWaitingForSave = require('../lib/dontCareWaitingForSave');
const handleError = require('../lib/handleError');

router.post(
  '/follow/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const user = await User.findById(userId);
      delete user.password;
      const index = user.followedAccounts.indexOf(id);
      if (index < 0) {
        const followed = [...user.followedAccounts, id];
        user.followedAccounts = followed;
        dontCareWaitingForSave(user);
        const [theUserItsGonnaFollow, err] = await handleError(
          User.findById(id)
        );
        if (err) throw err;
        const newFollowers = [...theUserItsGonnaFollow.followers, userId];
        theUserItsGonnaFollow.followers = newFollowers;
        const [returnedUser, errAnotherTime] = await handleError(
          theUserItsGonnaFollow.save()
        );
        if (errAnotherTime) throw errAnotherTime;
        delete returnedUser.password;
        return res.json({ profile: returnedUser });
      }
      const followed = user.followedAccounts.filter(
        followed => String(followed) !== String(id)
      );
      user.followedAccounts = followed;
      dontCareWaitingForSave(user);
      const [theUserItsGonnaFollow, err] = await handleError(User.findById(id));
      delete theUserItsGonnaFollow.password;
      if (err) throw err;
      // We filter it out because we know he wanna unfollow.
      const newFollowers = theUserItsGonnaFollow.followers.filter(
        follower => String(follower) !== String(userId)
      );
      theUserItsGonnaFollow.followers = newFollowers;
      const [saved, errAnotherTime] = await handleError(
        theUserItsGonnaFollow.save()
      );
      delete saved.password;
      if (errAnotherTime) throw errAnotherTime;
      return res.json({ profile: saved });
    } catch (err) {
      console.log(err);
      return res.status(404).json({ error: 'Error un/following the user...' });
    }
  }
);

module.exports = router;
