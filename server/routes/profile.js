const router = require('express').Router();
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const handleError = require('../lib/handleError');
/**
 * @GET
 * @PUBLIC
 * @description Testing purposes
 */
router.get('/', (req, res) => {});

/**
 * @GET
 * @PUBLIC
 * @description Get all the profile
 */
router.get('/:id', (req, res) => {});

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
