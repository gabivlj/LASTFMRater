const router = require('express').Router();
const passport = require('passport');

const addTrack = require('../lib/addTrack');
const Playlist = require('../models/Playlist');
const Track = require('../models/Track');

/**
 * @GET
 * @PUBLIC
 * @description Get a playlist by id
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  Playlist.findById({ _id: id })
    .then(async pl => {
      const playlist = pl;
      const tracks = pl.tracks.map(track => Track.findOne({ _id: track }));
      playlist.tracksShow = await Promise.all(tracks);
      console.log(playlist.tracksShow);
      return res.json({ playlist });
    })
    .catch(err => res.status(400).json({ error: 'Playlist not found.' }));
});

router.get(
  '/user/:user',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { user } = req.params;
    Playlist.find({ user })
      .then(playlist => {
        res.json({ playlists: playlist });
      })
      .catch(err => res.status(400).json({ error: 'Error finding playlists' }));
  }
);

/**
 * @POST
 * @PARAMS Playlist Schema
 * @DESCRIPTION Post a playlist in the mongodb
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user, playlistName, playlistDescription, playlistCover } = req.body;
    let { tracks } = req.body;
    if (!user) {
      return res.status(400).json({ error: 'User not authentificated.' });
    }
    if (!playlistName || !playlistDescription || !playlistCover) {
      return res.status(400).json({ error: 'Please, fill in all the fields.' });
    }
    try {
      tracks = tracks.map(track =>
        addTrack(track.duration, track.name, track.artist, track.album, Track)
      );
      tracks = await Promise.all(tracks);
      const playlist = new Playlist({
        user,
        playlistName,
        playlistDescription,
        playlistCover,
        tracks,
      });
      const __ = await playlist.save();
      return res.json(__);
    } catch (err) {
      return res.status(404).json('Error posting the playlist');
    }
  }
);

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
      const trackMongo = await addTrack(
        track.duration,
        track.name,
        track.artist,
        track.album,
        Track
      );
      pl.tracks.push(trackMongo._id);
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

router.post(
  '/delete/:id/:trackid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id, trackid } = req.params;
    const playlistToEdit = await Playlist.findOne({ _id: id });
    playlistToEdit.tracks = playlistToEdit.tracks.filter(
      track => track !== trackid
    );
    playlistToEdit
      .save()
      .then(pl => res.json(pl))
      .catch(err => console.log(err));
  }
);

module.exports = router;
