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

// router.get('/god/delete/image', (req, res) => {
//   User.findOne({ _id: '5cb88d162cd2833752b67fba' }).then(usr => {
//     usr.images = [];
//     usr.save().then(res => console.log('...'));
//   });
// });

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
  }
);

router.get(
  '/gramps',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user.id);
    const activities = await activity.getActivityFromUsersFollowers(
      user.followedAccounts
    );
    return res.json({ gramps: activities });
  }
);

router.get(
  '/get/friends',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { id } = req.user;
      const user = await User.findById(id);
      const listOfFriends = user.followedAccounts.filter(followed =>
        user.followers.includes(String(followed))
      );
      const usersFriends = (await User.find({
        $or: [...listOfFriends.map(friend => ({ _id: friend }))]
      })).map(friend => ({
        _id: friend._id,
        images: friend.images,
        username: friend.username
      }));
      res.json({ friends: usersFriends });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal server error. ' });
    }
  }
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
    Promise.all([playlists, artists || []])
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
    followed,
    follows,
    mutuals,
    itsUser
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
    Playlist.find({ user: username })
  );
  if (errors) {
    return res.status(404).json({ error: 'No playlists!' });
  }
  return res.json({ playlists });
});

// /**
//  * @POST
//  * @PRIVATE
//  * @description Posts a image to a profile, or updates it.
//  * @param { String } img Link to the image.
//  */
// router.post(
//   '/image',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     const { img } = req.body;
//     if (!img) {
//       return res.status(400).json({ error: 'Pass an image profile please' });
//     }
//     const user = await User.findById({
//       _id: req.user.id
//     });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found.' });
//     }
//     const profile = await Profile.findOne({
//       user: user._id
//     });
//     if (!profile) {
//       const profileSchema = new Profile({
//         img
//       });
//       profileSchema.save();
//       return res.json({ success: true });
//     }
//     profile.img = img;
//     profile.save();
//     return res.json({ success: true });
//   }
// );

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
      $or: [{ username: { $regex: query, $options: 'i' } }]
    }).sort({ name: -1 })
  );

  if (error) {
    res.status(404).json({ error: 'Error finding profiles ', profiles: [] });
  }

  const secureProfiles = profiles.map(profile => ({
    user: profile.username,
    lastfm: profile.lastfm,
    img: profile.img || '',
    followers: profile.followers || 0,
    _id: profile._id
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
  const userdb = await User.findOne({ username: user });
  if (!userdb) {
    return res.status(404).json({ error: 'No user found.' });
  }
  const orArray = userdb.ratedAlbums.map(album => ({ _id: album }));
  const albumsdb = await Album.find({
    $or: orArray
  });
  const albumShortened = albumsdb.map(album => ({
    name: album.name,
    artist: album.artist,
    rating: album.ratings.filter(
      rating => String(rating.user) === String(user)
    )[0],
    mbid: album.mbid,
    _id: album._id
  }));
  return res.json({ puntuations: albumShortened });
});

router.post(
  '/image',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { lz, sm, md, lg } = req.body;
    const { id } = req.user;
    const [err, user] = await handleError(User.findById(id));
    if (err) return res.status(403).json({ error: 'Error finding user' });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (user.images.length > 20)
      return res.status(400).json({ error: 'Not more than 5 images.' });
    user.images = [...user.images, { lz, sm, md, lg }];
    await user.save();
    return res.json({ images: user.images });
  }
);

module.exports = router;
