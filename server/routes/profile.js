const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const Profile = require('../models/Profile');
const handleError = require('../lib/handleError');
const LastFm = require('../classes/Lastfm');
const activity = require('../classes/Activity');
const Authenticator = require('../classes/Authenticator');
const mongoQueries = require('../lib/mongoQueries');
const getRecommendedUsers = require('../lib/getRecommendedUsers');
const RecommendedFollowers = require('../models/RecommendedFriends');

/**
 * @GET
 * @PRIVATE
 * @description Gets the image from a profile.
 */
router.get(
  '/image',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.json(profile);
  },
);

router.get(
  '/recommendedFollowers',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;

    const recommendedExcludePromise = RecommendedFollowers.findOne({
      user: user._id,
    });
    const [err, recommended] = await handleError(
      User.aggregate(
        mongoQueries.aggregations.user.recommendedFriends(user._id),
      ),
    );
    let recommendedExclude = null;

    if (err) {
      console.log(err);
      return res
        .status(404)
        .json({ error: 'Error, recommended friends not found...' });
    }

    const { recommendedFollow } = recommended[0];
    const userFollowing = user.followedAccounts.reduce(
      (prev, u) => ({ ...prev, [u]: u }),
      {},
    );

    recommendedExclude = await recommendedExcludePromise;
    if (!recommendedExclude) {
      const newRecommendedExclude = new RecommendedFollowers({
        user: user._id,
        recommended: [],
      });
      recommendedExclude = await newRecommendedExclude.save();
    }

    const objectExclude = recommendedExclude.recommended.reduce(
      (prev, now) => ({ ...prev, [now]: now }),
      {},
    );
    const recommendedEnd = recommendedFollow
      .filter(
        recommend =>
          String(recommend._id) !== String(user._id) &&
          !userFollowing[recommend._id] &&
          !objectExclude[String(recommend._id)],
      )
      .slice(0, 3)
      .map(u => ({ username: u.username, _id: u._id, images: u.images || [] }));
    if (recommendedEnd.length < 3) {
      const recommendedAdjust = await getRecommendedUsers(
        user,
        recommendedExclude,
        objectExclude,
        userFollowing,
      );
      return res.json({
        recommended: recommendedAdjust,
      });
    }
    return res.json({
      recommended: recommendedEnd,
    });
  },
);

router.get(
  '/gramps',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { query, user } = req;
      const { beginning, end } = query;
      const activities = await activity.getActivityFromUsersFollowers(
        user.followedAccounts,
        parseInt(beginning || 0, 10),
        parseInt(end || 4, 10),
      );
      return res.json({ gramps: activities });
    } catch (err) {
      console.log(err);
      return res.status(400, { error: 'Bad request' });
    }
  },
);

router.get('/gramps/:id', async (req, res) => {
  const [er, user] = await handleError(User.findById(req.params.id));
  if (er) {
    return res.status(400).json({
      error: 'Not a valid _id, or maybe a problem with the database!',
    });
  }

  if (!user) {
    return res.status(404).json({
      error: 'User not found...',
    });
  }

  delete user.password;
  const { query } = req;
  const { beginning = 0, end = 4 } = query;
  const activities = await activity.getActivityFromUsersFollowers(
    [user._id],
    parseInt(beginning || 0, 10),
    parseInt(end || 4, 10),
  );
  return res.json({ gramps: activities });
});

router.get(
  '/get/friends',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { user } = req;
      const reducedFollowers = user.followers.reduce(
        (prev, u) => ({ ...prev, [String(u)]: u }),
        {},
      );
      const listOfFriends = user.followedAccounts.filter(
        followed =>
          // user.followers.includes(String(followed)),
          reducedFollowers[String(followed)],
      );
      if (listOfFriends.length <= 0) {
        return res.json({ friends: [] });
      }
      const friends = await User.find({
        $or: [...listOfFriends.map(friend => ({ _id: friend }))],
      });
      if (!friends || friends.length <= 0) {
        return res.json({ friends: [] });
      }
      const usersFriends = friends.map(friend => ({
        _id: friend._id,
        images: friend.images,
        username: friend.username,
      }));
      return res.json({ friends: usersFriends });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: 'Internal server error. ' });
    }
  },
);

/**
 * @GET
 * @PUBLIC
 * @description Testing purposes
 */
router.get('/', async (req, res) => {
  res.json(await User.find());
});

/**
 * @GET
 * @PUBLIC
 * @description Get all data for the profile.
 */
router.get('/:id', async (req, res) => {
  // OPTIONAL.
  const { userId } = req.query;
  const { id } = req.params;
  const [error, user] = await handleError(User.findOne({ username: id }));
  if (error) {
    console.log(error);
    return res.status(404).json({ error: 'Error finding the profile.' });
  }
  if (!user) {
    return res.status(400).json({ error: 'Error finding the profile.' });
  }
  delete user.password;
  // Additional information...
  const itsUser = String(userId) === String(user._id);
  const initialChecking = !!(
    userId &&
    !itsUser &&
    userId.length > 0 &&
    typeof userId === 'string'
  );

  // TODO:  These checkings are O(n), not bad but we really need to use followingObject in the future...
  const followed = !!(
    initialChecking && user.followers.indexOf(String(userId)) > -1
  );
  const follows = !!(
    initialChecking && user.followedAccounts.indexOf(String(userId)) > -1
  );
  const mutuals = !!(followed && follows);

  const playlists = Playlist.find({ user: user.username });
  const lastFm = new LastFm();
  const artists = !Authenticator.isEmpty(user.lastfm)
    ? lastFm.getUsersArtist(user.lastfm)
    : null;
  const [errorPromise, [playlistsFinal, artistsFinal]] = await handleError(
    Promise.all([playlists, artists || []]),
  );
  if (errorPromise) {
    console.log(errorPromise);
    return res.status(404).json({ error: 'Error providind profile' });
  }

  const profile = {
    user: user.username,
    artists: artistsFinal || [],
    playlists: playlistsFinal || [],
    ratedAlbums: user.ratedAlbums || [],
    profileImage: user.img,
    followers: user.followers || 0,
    lastfm: user.lastfm || '',
    images: user.images || [],
    _id: user._id,
    likedAlbums: user.likedAlbums,
    followed,
    follows,
    mutuals,
    itsUser,
  };
  return res.json({ profile });
});

/**
 * @GET
 * @PUBLIC
 * @description Gets all the playlists from an user.
 */
router.get('/playlists/:username', async (req, res) => {
  const { username } = req.params;
  const [errors, playlists] = await handleError(
    Playlist.find({ user: username }),
  );
  if (errors) {
    return res.status(404).json({ error: 'No playlists!' });
  }
  return res.json({ playlists });
});

/**
 * @GET
 * @PUBLIC
 * @DESCRIPTION Returns the searched query related to profiles
 * @param { String } query
 * @queryparam { Number } numberOfElements. (OPTIONAL)
 */
router.get('/search/:query', async (req, res) => {
  const { query } = req.params;
  const { numberOfElements = 9 } = req.query;
  const parsedElements = parseInt(numberOfElements, 10);
  let finalProfiles;

  if (query === null || query === undefined || query.trim() === '') {
    return res.json({ profiles: [] });
  }

  const [error, profiles] = await handleError(
    User.find({
      $or: [{ username: { $regex: query, $options: 'i' } }],
    }).sort({ name: -1 }),
  );

  if (error) {
    res.status(404).json({ error: 'Error finding profiles ', profiles: [] });
  }

  const secureProfiles = profiles.map(profile => ({
    user: profile.username,
    lastfm: profile.lastfm,
    img: profile.img || '',
    followers: profile.followers || 0,
    _id: profile._id,
  }));

  if (
    Array.isArray(secureProfiles) &&
    secureProfiles.length >= parsedElements
  ) {
    finalProfiles = secureProfiles.slice(0, parsedElements + 1);
  } else {
    finalProfiles = secureProfiles;
  }

  res.json({ profiles: finalProfiles });
});

/**
 * @GET
 * @PUBLIC
 * @description Gets all the ratings formatted fine for the client.
 */
router.get('/ratings/:user', async (req, res) => {
  const { user } = req.params;
  const beginning = parseInt(req.query.beginning || 0, 10);
  const limit = parseInt(req.query.limit || 10, 10);
  const userdb = await User.findOne({ username: user });
  if (!userdb) {
    return res.status(404).json({ error: 'No user found.' });
  }
  const orArray = userdb.ratedAlbums
    .slice(beginning, limit + 1)
    .map(album => ({ _id: album }));
  if (orArray.length === 0) return res.json({ puntuations: [] });
  const albumsdb = await Album.find({
    $or: orArray,
  });
  const findRating = album => {
    for (let i = 0; i < album.ratings.length; i += 1) {
      if (String(album.ratings[i].user) === String(user)) {
        return album.ratings[i];
      }
    }
    return null;
  };

  const albumShortened = albumsdb.map(album => ({
    name: album.name,
    artist: album.artist,
    rating: findRating(album),
    mbid: album.mbid,
    _id: album._id,
  }));
  return res.json({ puntuations: albumShortened });
});

router.post(
  '/image',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { lz, sm, md, lg } = req.body;
    const { user } = req;
    //  const [err, user] = await handleError(User.findById(id));
    // if (err) return res.status(403).json({ error: 'Error finding user' });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (user.images.length > 20)
      return res.status(400).json({ error: 'Not more than 5 images.' });
    user.images = [...user.images, { lz, sm, md, lg }];
    await user.save();
    return res.json({ images: user.images });
  },
);

module.exports = router;
