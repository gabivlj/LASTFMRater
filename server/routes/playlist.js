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
    if (!playlistName || !playlistDescription) {
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
  console.log(req.body);
  if (!name || !artist)
    return res.status(400).json({
      error:
        'Not all the fields are filled in, please make sure that you are passing everything right or there are no errors in the front end',
    });

  try {
    // Find the playlist
    const pl = await Playlist.findOne({ user, _id: id });
    if (!pl) {
      return res.status(400).json({ error: 'Error finding the playlist.' });
    }
    // Add the track
    const mongoTrack = await Track.findOne({ name, artist });
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
      return res.json({ playlist: finalPlaylist_, newTrack: trackMongo });
    }
    pl.tracks.push(mongoTrack._id);
    const finalPlaylist = await pl.save();
    return res.json({ playlist: finalPlaylist, newTrack: mongoTrack });
  } catch (err) {
    res.status(400).json({ error: 'Error posting the track.', errorinfo: err });
  }
});

/**
 * @POST
 * @PRIVATE
 * @description Pass id of the playlist and the trackid and delete the track id from the tracks array or pass the index.
 */
router.post(
  '/delete/:id/:trackid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { id, trackid } = req.params;
      let { indexToDeleteFrom } = req.body;
      const playlistToEdit = await Playlist.findOne({ _id: id });
      // If the index passed is null just set it to -1
      if (indexToDeleteFrom === null || indexToDeleteFrom === undefined) {
        console.warn('Remember to pass index to the route, faster processing.');
        indexToDeleteFrom = -1;
      }
      // If the index is not valid just make a map indexOf slice. Else slice on index.
      if (
        indexToDeleteFrom < 0 ||
        indexToDeleteFrom >= playlistToEdit.tracks.length
      ) {
        const plId = playlistToEdit.tracks.map(track => String(track._id));
        const index = plId.indexOf(trackid);
        if (index >= 0)
          playlistToEdit.tracks = [
            ...playlistToEdit.tracks.slice(0, index),
            ...playlistToEdit.tracks.slice(index + 1, playlistToEdit.length),
          ];
      } else {
        playlistToEdit.tracks = [
          ...playlistToEdit.tracks.slice(0, indexToDeleteFrom),
          ...playlistToEdit.tracks.slice(
            indexToDeleteFrom + 1,
            playlistToEdit.length
          ),
        ];
      }
      playlistToEdit
        .save()
        .then(pl => res.json({ tracks: pl.tracks }))
        .catch(err => console.log(err));
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .json({ error: 'Bug with the system', message: err });
    }
  }
);

module.exports = router;
