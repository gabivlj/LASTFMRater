const router = require('express').Router();
const passport = require('passport');
const Album = require('../models/Album');
const Lastfm = require('../classes/Lastfm');
const handleError = require('../lib/handleError');

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
    // TODO Make our DB find albums like the lastfm api
    // const album = await Album.find({ name })
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
// @OPTIONALQUERYPARAMS username
router.get('/:albumname/:artistname', async (req, res) => {
  const { username } = req.query;
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
    // ?????
    if (album__ && album__.tracks.track.length <= 0) {
      // Find Album Tracks in our database incase we have them...
      // if (tracks && tracks.length > 0) {
      //   album__.tracks = find.tracks;
      // }
    }
    album__.ratings = find.ratings;
    album__.reviews = find.reviews;
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
    const comment = {
      text,
      username,
      user: req.user.id,
      likes: [],
    };
    album.comments = [comment, ...album.comments];
    album.save();
    res.json({ comments: album.comments });
  }
);

module.exports = router;
