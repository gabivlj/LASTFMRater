const router = require('express').Router();
const passport = require('passport');
const Album = require('../models/Album');
const Lastfm = require('../classes/Lastfm');
const handleError = require('../lib/handleError');
const dontCareWaitingForSave = require('../lib/dontCareWaitingForSave');
const albumHelper = require('../classes/Album');
const Comment = require('../classes/Comment');
const CommentSchema = require('../classes/CommentSchema');
const Activity = require('../classes/Activity');

const FM = new Lastfm(null);

/**
 * @GET
 * @PRIVATE
 * @DESCRIPTION Get an album from database by id
 */

router.get('/:id', (req, res) => {
  Album.findById({ _id: req.params.id })
    .then(album => res.json(album))
    .catch(err => res.status(404).catch({ error: 'Fatal error' }));
});

/**
 * @POST
 * @PUBLIC
 * @DESCRIPTION Try to post an album, if it does already exist just res.json(album)
 */

router.post('/', async (req, res) => {
  try {
    const album = await Album.findOne({
      name: req.body.albumname,
      artist: req.body.artist,
      mbid: req.body.mbid
    });
    if (!album) {
      const newAlbum = new Album({
        name: req.body.albumname,
        artist: req.body.artist,
        mbid: req.body.mbid
      });
      newAlbum
        .save()
        .then(saved => res.json(saved))
        .catch(err => res.status(404).json('Errors have been made'));
    } else {
      res.json(album);
    }
  } catch (err) {
    res.status(400).json('INTERNAL ERROR');
  }
});

/**
 * @POST
 * @PRIVATE
 * @DESCRIPTION Try to add a review, if it already exists just don't add it.
 */

router.post('/review/:albumid', (req, res) => {});

/**
 * @GET
 * @PUBLIC
 * @DESCRIPTION Gets all the albums that match with the finding
 */

router.get('/search/:name', async (req, res) => {
  let { page, limit } = req.query;
  limit = limit || 20;
  page = page || 1;
  const { name } = req.params;

  try {
    // const album = await Album.find({ $or: [ { name: { '$regex': name, options: '$i' } }]  }).sort( { name: -1 } );
    const album__ = await FM.searchAlbums(name, limit, page);
    return res.json(album__);
  } catch (err) {
    return res.status(400).json('Error finding albums');
  }
});

/**
 * @POST
 * @PRIVATE
 * @DESCRIPTION Try to add a rating to the album with the user id, if it does already exist just update it.
 */

router.post(
  '/rate/:albumid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const album = await Album.findOne({
        _id: req.params.albumid
      });
      // const userPromise = User.findOne({ _id: req.user._id });
      // const [user, album] = await Promise.all([userPromise, albumPromise]);

      if (album) {
        const index = album.ratings
          .map(rating => rating.user)
          .indexOf(req.body.userid);
        // If rating does not exist.
        if (index <= -1) {
          // Add it.
          album.ratings.push({
            puntuation: req.body.puntuation,
            user: req.body.userid
          });
        } else {
          // else replace
          album.ratings.splice(index, 1, {
            puntuation: req.body.puntuation,
            user: req.body.userid
          });
        }
        Activity.addSomethingActivity(
          Activity.createRatedInformation(
            {
              _id: album._id,
              name: `${album.name} by ${album.artist}`,
              score: req.body.puntuation,
              pathname: `/album/${album.artist}/${album.name}/${album.mbid}`
            },
            { userId: req.user.id, username: req.user.username }
          )
        );
        album
          .save()
          .then(res_ => res.json({ ratings: res_.ratings, __v: res_.__v }))
          .catch(err => console.log(err));
      } else {
        return res.status(400).json('Error finding the album.');
      }
    } catch (err) {
      console.log(err);
      return res.status(404).json('Error.');
    }
  }
);

// @GET
// TODO This should be a PUT request please.
// @OPTIONALQUERYPARAMS username, userId, mbid
router.get('/:albumname/:artistname', async (req, res) => {
  const { username, userId, mbid } = req.query;
  const AlbumData = {
    albumname: req.params.albumname,
    username,
    artist: req.params.artistname,
    mbid
  };
  let albumFM = await FM.getAlbum(AlbumData);

  if (albumFM && albumFM.album) {
    albumFM = albumFM.album;
    // TODO: Please check this better.
    let albumDB = await Album.findOne({
      artist: albumFM.artist,
      name: albumFM.name
    });
    if (!albumDB) {
      const newAlbum = new Album({
        artist: albumFM.artist,
        name: albumFM.name,
        mbid: albumFM.mbid,
        lastfmSource: true
      });
      const saved = await newAlbum.save();
      albumDB = saved;
    }

    if (!albumDB.lastfmSource) {
      albumDB.lastfmSource = true;
      dontCareWaitingForSave(albumDB, false);
    }

    albumFM.ratings = albumDB.ratings;
    albumFM.reviews = albumDB.reviews;
    albumFM._id = albumDB._id;
    albumFM.__v = albumDB.__v;
    albumFM.images = albumDB.images;
    albumFM.lastfmSource = albumDB.lastfmSource;
    return res.json({ album: albumFM });
  }
  const album = await Album.findOne({
    name: req.params.albumname,
    artist: req.params.artistname,
    _id: mbid,
    lastfmSource: false
  });
  if (!album) {
    return res.status(400).json('Album not found!');
  }
  return res.json({ album });
});

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
    const [error, album] = await handleError(Album.findById(id));
    if (error) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    const comment = new CommentSchema(req.user.id, username, text);
    const [errorReturn, returner] = await handleError(
      Comment.postComment(album, comment)
    );

    if (errorReturn) {
      return res.status(500).json({ error: 'Error with the server.' });
    }

    res.json({ comments: returner });
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
  '/comment/like/:albumId/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id, albumId } = req.params;
    const { fastIndex } = req.body;
    const userId = req.user.id;
    // todo: handle error
    const album = await Album.findById({ _id: albumId });
    if (!album) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    const obj = await Comment.addOpinionToComment(
      album,
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
  '/comment/dislike/:albumId/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { id, albumId } = req.params;
    const { fastIndex } = req.body;
    const userId = req.user.id;
    // todo: handle error
    const album = await Album.findById({ _id: albumId });
    if (!album) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    const obj = await Comment.addOpinionToComment(
      album,
      'dislikes',
      id,
      fastIndex,
      userId,
      'likes'
    );

    res.json({ comments: [...obj.instanceSaved.comments] });
  }
);

router.post(
  '/image/upload/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { lz, sm, md, lg } = req.body;
    // !! FATAL ERROR IF WE ARE NOT CHECKING LZ SM MD LG PARAMS TODO
    const { id } = req.params;
    const [err, album] = await handleError(Album.findById(id));
    if (err) return res.status(403).json({ error: 'Error finding album' });
    if (!album) return res.status(404).json({ error: 'Album not found.' });
    if (album.images.length > 5)
      return res.status(400).json({ error: 'Not more than 5 images.' });
    album.images = [...album.images, { lz, sm, md, lg }];
    await album.save();
    return res.json({ images: album.images });
  }
);

module.exports = router;
