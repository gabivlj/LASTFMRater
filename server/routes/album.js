const router = require('express').Router();
const passport = require('passport');
const Album = require('../models/Album');
const Lastfm = require('../classes/Lastfm');
const handleError = require('../lib/handleError');
const albumHelper = require('../classes/Album');
const Comment = require('../classes/Comment');
const CommentSchema = require('../classes/CommentSchema');

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
      mbid: req.body.mbid,
    });
    if (!album) {
      const newAlbum = new Album({
        name: req.body.albumname,
        artist: req.body.artist,
        mbid: req.body.mbid,
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
    res.status(400).json('Error finding albums');
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
        _id: req.params.albumid,
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
            user: req.body.userid,
          });
        } else {
          // else replace
          album.ratings.splice(index, 1, {
            puntuation: req.body.puntuation,
            user: req.body.userid,
          });
        }
        album
          .save()
          .then(res_ => res.json({ ratings: res_.ratings, __v: res_.__v }))
          .catch(err => console.log(err));
      } else {
        return res.status(400).json('Error finding the album.');
      }
    } catch (err) {
      return res.status(404).json('Error.');
    }
  }
);

// @GET
// @OPTIONALQUERYPARAMS username, userId
router.get('/:albumname/:artistname', async (req, res) => {
  const { username, userId } = req.query;
  const AlbumData = {
    albumname: req.params.albumname,
    username,
    artist: req.params.artistname,
  };
  let album__ = await FM.getAlbum(AlbumData);

  if (album__) {
    album__ = album__.album;
    const find = await Album.findOne({
      artist: album__.artist,
      name: album__.name,
    });

    album__.ratings = find.ratings;
    album__.reviews = find.reviews;
    // TO be honest this is so bad I just cannot believe we are doing this haha.
    album__.comments = find.comments.map(comment => comment._doc);
    // if (userId)
    //   album__.comments = albumHelper.getIfUserLikedOrNot(
    //     album__.comments,
    //     userId
    //   );
    // album__.comments = albumHelper.mapLikesDislikes(album__.comments);
    album__._id = find._id;
    album__.__v = find.__v;
    return res.json({ album: album__ });
  }
  const album = await Album.findOne({
    name: req.params.albumname,
    artist: req.params.artistname,
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
      userId
    );

    res.json({ comments: [...obj.instanceSaved.comments] });
  }
);

/**
 * @POST
 * @PRIVATE
 * @PARAM id, commentId, fastIndex.
 * @RETURNS The array with the new comment like...
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
      userId
    );

    res.json({ comments: [...obj.instanceSaved.comments] });
  }
);

module.exports = router;
