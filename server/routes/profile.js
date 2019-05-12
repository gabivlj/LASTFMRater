const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const Profile = require('../models/Profile');
const handleError = require('../lib/handleError');
const LastFm = require('../classes/Lastfm');
const Authenticator = require('../classes/Authenticator');

/**
 * @GET
 * @PUBLIC
 * @description Testing purposes
 */
router.get('/', (req, res) => {});

/**
 * @GET
 * @PUBLIC
 * @description Get all data for the profile.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [error, user] = await handleError(User.findOne({ username: id }));
  if (error) {
    console.log(error);
    return res.status(404).json({ error: 'Error finding the profile ' });
  }
  const playlists = Playlist.find({ user: user.username });

  const lastFm = new LastFm();
  const artists = !Authenticator.isEmpty(user.lastfm)
    ? lastFm.getUsersArtist(user.lastfm)
    : null;
  const [errorPromise, [playlistsFinal, artistsFinal]] = await handleError(
    Promise.all([playlists, artists || null])
  );
  if (errorPromise) {
    console.log(errorPromise);
    return res.status(404).json({ error: 'Error providind profile' });
  }

  const profile = {
    user: user.username,
    artists: artistsFinal,
    playlists: playlistsFinal,
    ratedAlbums: user.ratedAlbums,
    profileImage: user.img,
    followers: user.followers || 0,
    lastfm: user.lastfm || '',
  };
  res.json({ profile });
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

/**
 * @POST
 * @PRIVATE
 * @description Posts a image to a profile, or updates it.
 * @param { String } img Link to the image.
 */
router.post(
  '/image',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { img } = req.body;
    if (!img) {
      return res.status(400).json({ error: 'Pass an image profile please' });
    }
    const user = await User.findById({
      _id: req.user.id,
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const profile = await Profile.findOne({
      user: user._id,
    });
    if (!profile) {
      const profileSchema = new Profile({
        img,
      });
      profileSchema.save();
      return res.json({ success: true });
    }
    profile.img = img;
    profile.save();
    return res.json({ success: true });
  }
);

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

module.exports = router;
