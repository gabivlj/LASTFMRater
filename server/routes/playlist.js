const router = require('express').Router();
const passport = require('passport');

const handleError = require('../lib/handleError');
const addTrack = require('../lib/addTrack');
const Playlist = require('../models/Playlist');
const Track = require('../models/Track');
const RatingHelper = require('../lib/RatingHelper');
const albumHelper = require('../classes/Album');
const CommentSchema = require('../classes/CommentSchema');
const Comment = require('../classes/Comment');
const mongoQueries = require('../lib/mongoQueries');

/**
 * @GET
 * @PUBLIC
 * @description Get a playlist by id
 * @OPTIONAL userId,
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  Playlist.findById({ _id: id })
    .then(async pl => {
      const playlist = pl;
      const tracks = pl.tracks.map(track => Track.findOne({ _id: track }));
      playlist.tracksShow = await Promise.all(tracks);
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
        tracks
      });
      const __ = await playlist.save();
      return res.json({ playlist: __ });
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
    album
  };
  // Make a simple check if the fields are all correct.
  if (!name || !artist)
    return res.status(400).json({
      error:
        'Not all the fields are filled in, please make sure that you are passing everything right or there are no errors in the front end'
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
    return res
      .status(400)
      .json({ error: 'Error posting the track.', errorinfo: err });
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
            ...playlistToEdit.tracks.slice(index + 1, playlistToEdit.length)
          ];
      } else {
        playlistToEdit.tracks = [
          ...playlistToEdit.tracks.slice(0, indexToDeleteFrom),
          ...playlistToEdit.tracks.slice(
            indexToDeleteFrom + 1,
            playlistToEdit.length
          )
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

/**
 * @POST
 * @PRIVATE
 * @description Interchange 2 tracks between them by index.
 * @param {String} playlistId Pass playlist id.
 */

router.post(
  '/change/:index1/:indexToSet',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    function ifIndexEqualsAdd(currentIndex, badIndex, prev, current) {
      return parseInt(badIndex) === currentIndex
        ? [...prev]
        : [...prev, current];
    }
    const { index1, indexToSet } = req.params;
    const { playlistId } = req.body;
    const { tracksShow } = req.body;
    const [error, playlist] = await handleError(
      Playlist.findOne({ _id: playlistId })
    );
    if (error) {
      return res
        .status(400)
        .json({ error: 'Playlist not found or error with server' });
    }

    // Make these 2 reduce in one.
    const tracksShowReduced = tracksShow.reduce(
      (prev, current, index) =>
        index === parseInt(indexToSet, 10)
          ? // If it's the index we are setting to just add the track and then the track that was there.
            [...prev, tracksShow[index1], current]
          : // If the index1 is equal to index, don't add the track, else do it because it's not the track we are filtering out.
            ifIndexEqualsAdd(index, index1, prev, current),
      []
    );

    // TODO. Or make this a map lol.
    playlist.tracks = playlist.tracks.reduce(
      (prev, current, index) =>
        index === parseInt(indexToSet, 10)
          ? [...prev, playlist.tracks[index1], current]
          : ifIndexEqualsAdd(index, index1, prev, current),
      []
    );
    playlist
      .save()
      .then(pl =>
        res.json({ tracksId: pl.tracks, tracksForShowing: tracksShowReduced })
      )
      .catch(err =>
        res.status(404).json({ error: 'Error with server', msg: err })
      );
  }
);

router.post(
  '/interchange/:index1/:index2',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { index1, index2 } = req.params;
    const { playlistId } = req.body;
    const { tracksShow } = req.body;
    const [error, playlist] = await handleError(
      Playlist.findOne({ _id: playlistId })
    );

    if (error) {
      return res
        .status(400)
        .json({ error: 'Playlist not found or error with server' });
    }

    const subs = playlist.tracks[index1];
    playlist.tracks[index1] = playlist.tracks[index2];
    playlist.tracks[index2] = subs;
    const subs1 = tracksShow[index1];
    tracksShow[index1] = tracksShow[index2];
    tracksShow[index2] = subs1;
    playlist
      .save()
      .then(pl =>
        res.json({ tracksId: pl.tracks, tracksForShowing: tracksShow })
      )
      .catch(err =>
        res.status(404).json({ error: 'Error with server', msg: err })
      );
  }
);

/**
 * @POST
 * @PRIVATE
 * @description Add a rating to a playlist.
 * @param {String} userId, Optional if doing auth
 * @param {String} playlistId
 * @param {Number} puntuation, (body)
 */

router.post(
  '/rate/:playlistId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id } = req.user;
    const { playlistId } = req.params;
    const { puntuation } = req.body;
    const parsedPuntuation = puntuation ? parseInt(puntuation) : 0;
    const ratingHelper = new RatingHelper(Playlist);
    const [error, PlaylistToReturn] = await handleError(
      ratingHelper.addRating(id, playlistId, parsedPuntuation)
    );
    if (error) {
      return res
        .status(404)
        .json({ error: 'Error handling the puntuation...' });
    }
    res.json({
      rating: PlaylistToReturn.ratings,
      // We predict the next version of playlist, so React knows when playlist has REALLY changed.
      __v: PlaylistToReturn.__v + 1
    });
    // We save later because I want a fast response.
    PlaylistToReturn.save();
  }
);

/**
 * @GET
 * @PUBLIC
 * @DESCRIPTION Returns the searched query related to playlists
 * @param { String } query
 * @queryparam { String } numberOfElements (OPTIONAL)
 */
router.get('/search/:query', async (req, res) => {
  const { query } = req.params;
  const { numberOfElements = 9 } = req.query;
  const parsedElements = parseInt(numberOfElements, 10);
  let finalPlaylists;

  if (query === null || query === undefined || query.trim() === '') {
    return res.json({ playlists: [] });
  }

  /*
  db.collection.aggregate([ 
    { "$project": { 
        "averageAge": { "$avg": "$patients.age" } 
    }}
]) 
  */
  /**
  * {
        $match: {
          $or: [{ playlistName: { $regex: query, $options: 'i' } }]
        }
      }
  */
  const regex = {
    $match: {
      $or: [{ playlistName: { $regex: query, $options: 'i' } }]
    }
  };
  const [error, playlists] = await handleError(
    Playlist.aggregate(
      mongoQueries.aggregations.playlist.makeAverage(regex)
    ).sort({ averageScore: -1 })
  );

  if (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error finding the playlists. ' });
  }

  if (Array.isArray(playlists) && playlists.length >= parsedElements) {
    finalPlaylists = playlists.slice(0, parsedElements + 1);
  } else {
    finalPlaylists = playlists;
  }

  res.json({ playlists: finalPlaylists });
});

/**
 * @POST
 * @PRIVATE
 * @PARAM id, commentId, fastIndex.
 * @RETURNS The array with the new comment like...
 * @deprecated
 */
router.post(
  '/comment/like/:playlistId/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id, playlistId } = req.params;
    const { fastIndex } = req.body;
    const userId = req.user.id;
    // todo: handle error
    const playlist = await Playlist.findById({ _id: playlistId });
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }
    const obj = await Comment.addOpinionToComment(
      playlist,
      'likes',
      id,
      fastIndex,
      userId,
      'dislikes'
    );

    res.json({ comments: [...obj.instanceSaved.comments] });
  }
);

/**
 * @POST
 * @PRIVATE
 * @PARAM id, commentId, fastIndex.
 * @RETURNS The array with the new comment like...
 * @deprecated
 */
router.post(
  '/comment/dislike/:playlistId/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id, playlistId } = req.params;
    const { fastIndex } = req.body;
    const userId = req.user.id;
    // todo: handle error
    const playlist = await Playlist.findById({ _id: playlistId });
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }
    const obj = await Comment.addOpinionToComment(
      playlist,
      'dislikes',
      id,
      fastIndex,
      userId,
      'likes'
    );

    res.json({ comments: [...obj.instanceSaved.comments] });
  }
);

/**
 * @POST
 * @PRIVATE
 * @BODY text, username
 * @PARAM id: album id
 * @deprecated
 */
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { text, username } = req.body;
    const { id } = req.params;
    const [error, playlist] = await handleError(Playlist.findById(id));
    if (error) {
      return res.status(404).json({ error: 'playlist not found.' });
    }
    const comment = new CommentSchema(req.user.id, username, text);
    const [errorReturn, returner] = await handleError(
      Comment.postComment(playlist, comment)
    );

    if (errorReturn) {
      return res.status(500).json({ error: 'Error with the server.' });
    }

    res.json({ comments: returner });
  }
);

module.exports = router;
