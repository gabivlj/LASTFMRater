const router = require('express').Router();
const Playlist = require('../models/Playlist');
const Track = require('../models/Track');

router.get('/:id', (req, res) => {});

/**
 * @POST
 * @PARAMS Playlist Schema
 * @DESCRIPTION Post a playlist in the mongodb
 */
router.post('/', async (req, res) => {
  const { user, playlistName, playlistDescription, playlistCover } = req.body;

  if (!user) {
    res.status(400).json({ error: 'User not authentificated.' });
  }
  if (!playlistName || !playlistDescription || !playlistCover) {
    res.status(400).json({ error: 'Please, fill in all the fields.' });
  }

  try {
    const playlist = new Playlist({
      user,
      playlistName,
      playlistDescription,
      playlistCover,
    });
    const __ = await playlist.save();
    res.json(__);
  } catch (err) {
    res.status(404).json('Error posting the playlist');
  }
});

/**
 * @POST
 * @PRIVATE
 * @DESCRIPTION Post a track
 */
router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { user, duration, name, artist, album } = req.body;
  const track = {
    duration,
    name,
    artist,
    album,
  };
  // Make a simple check if the fields are all correct.
  if (!duration || !name || !artist || !album)
    return res.status(400).json({
      error:
        'Not all the fields are filled in, please make sure that you are passing everything right or there are no errors in the front end',
    });

  try {
    // Find the playlist
    const pl = await Playlist.findOne({ user, id });
    if (!pl) {
      return res.status(400).json({ error: 'Error finding the playlist.' });
    }
    // Add the track
    const mongoTrack = await Track.findOne({ duration, name, artist, album });
    if (!mongoTrack) {
      const T = new Track(track);
      const tr = await T.save();
      pl.tracks.push(tr._id);
      const finalPlaylist_ = await pl.save();
      return res.json(finalPlaylist_);
    }
    pl.tracks.push(mongoTrack._id);
    const finalPlaylist = await pl.save();
    return res.json(finalPlaylist);
  } catch (err) {
    res.status(400).json({ error: 'Error posting the track.', errorinfo: err });
  }
});
module.exports = router;
