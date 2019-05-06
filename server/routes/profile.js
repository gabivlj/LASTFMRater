const router = require('express').Router();
const User = require('../models/User');
const Playlist = require('../models/Playlist');
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
  const [error, user] = await handleError(User.findById({ _id: id }));
  if (error) {
    console.log(error);
    return res.status(404).json({ error: 'Error finding the profile ' });
  }
  const playlists = Playlist.find({ user: user.username });

  const lastFm = new LastFm();
  const albums = !Authenticator.isEmpty(user.lastfm)
    ? lastFm.getUsersArtist(user.lastfm)
    : null;
  const [errorPromise, [playlistsFinal, albumsFinal]] = await handleError(
    Promise.all([playlists, albums || null])
  );
  if (errorPromise) {
    console.log(errorPromise);
    return res.status(404).json({ error: 'Error providind profile' });
  }

  const profile = {
    albums: albumsFinal,
    playlists: playlistsFinal,
    ratedAlbums: user.ratedAlbums,
    user: user.username,
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

module.exports = router;
