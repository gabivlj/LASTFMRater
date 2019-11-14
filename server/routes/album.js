const router = require('express').Router();
const passport = require('passport');
const Album = require('../models/Album');
const Lastfm = require('../classes/Lastfm');
const handleError = require('../lib/handleError');
const dontCareWaitingForSave = require('../lib/dontCareWaitingForSave');
const albumHelper = require('../classes/Album');
const Comment = require('../classes/Comment');
const CommentSchema = require('../classes/CommentSchema');
const Chart = require('../classes/Chart');
const mongoQueries = require('../lib/mongoQueries');
const averageWithPowerLevel = require('../lib/averageWithPowerLevel');
const Rating = require('../classes/Rating');
const User = require('../models/User');

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

router.post(
  '/form',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user, body } = req;
    const { name, artist, artistId } = body;
  },
);

/**
 * @POST
 * @PRIVATE
 * @DESCRIPTION Try to add a review, if it already exists just don't add it.
 */

router.post('/review/:albumid', (req, res) => {});

/**
 * @description Returns the 3 recommended albums for the loged user that liked the album.
 */
router.get(
  '/recommend_like/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user, params } = req;
    const [err, album] = await handleError(
      Album.aggregate(
        mongoQueries.aggregations.user.getMostPrestigiousUsers(params.id),
      ),
    );
    if (err) return console.log(err);
    const recommendedAlbums = [];
    for (const userElement of album[0].users || []) {
      for (const album of userElement.likedAlbums || []) {
        const { k, v } = album;
        if (k && v && !user.likedAlbums[k]) {
          recommendedAlbums.push({ [k]: v });
          break;
        }
      }
    }

    return res.json({ albums: recommendedAlbums });
  },
);

/**
 * @description Each hour do this.
 */
router.get('/get/hottest', async (_, res) => {
  // The query should return the hottest albums of the day
  // Like the most rated, but the thing is we should get only the albums
  // that got rated on the same as today and also order it by sum
  // For the moment we will use JavaScript
  function sameDay(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
  const [err, albums] = await handleError(Album.find());
  const pickReview = (a, b) => {
    if (a.numberOfReviewsEachDay.length === 0) {
      return 1;
    }
    if (b.numberOfReviewsEachDay.length === 0) {
      return -1;
    }
    const elementA =
      a.numberOfReviewsEachDay[a.numberOfReviewsEachDay.length - 1];
    const elementB =
      b.numberOfReviewsEachDay[b.numberOfReviewsEachDay.length - 1];

    const today = new Date(Date.now());
    const sameDayA = sameDay(new Date(a.date), today);
    const sameDayB = sameDay(new Date(b.date), today);
    if (sameDayA && !sameDayB) {
      return -1;
    }
    if (!sameDayA && sameDayB) {
      return 1;
    }
    return elementB.sum - elementA.sum;
  };
  if (err) {
    console.log(err);
    return res.status(404).json({ error: 'Error finding albums.' });
  }
  const sortedAlbums = albums.sort((a, b) => pickReview(a, b));
  return res.json({
    sortedAlbums: sortedAlbums.map(album => ({
      _id: album._id,
      name: album.name,
      artist: album.artist,
      sum:
        album.numberOfReviewsEachDay.length > 0
          ? album.numberOfReviewsEachDay[
              album.numberOfReviewsEachDay.length - 1
            ]
          : 0,
    })),
  });
});

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
  '/rate/:albumID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { user } = req;
      const { puntuation } = req.body;
      const album = await Rating.addRating(
        Album,
        req.params.albumID,
        {
          puntuation,
          powerLevel: user.powerLevel,
        },
        user,
        album => ({
          _id: album._id,
          name: `${album.name} by ${album.artist}`,
          score: puntuation,
          pathname: `/album/${album.artist}/${album.name}/${album.mbid}`,
        }),
      );
      console.log(album);
      if (!album) {
        return res.status(404).json({ error: 'Error in the request.' });
      }
      return res.json({ album, user });
      // const { user } = req;
      // const album = await Album.findOne({
      //   _id: req.params.albumid,
      // });
      // // const userPromise = User.findOne({ _id: req.user._id });
      // // const [user, album] = await Promise.all([userPromise, albumPromise]);

      // if (album) {
      //   const index = album.ratings
      //     .map(rating => rating.user)
      //     .indexOf(req.body.userid);
      //   // If rating does not exist.
      //   if (index <= -1) {
      //     // Add it.
      //     album.ratings.push({
      //       puntuation: req.body.puntuation,
      //       user: user.username,
      //       powerLevel: user.powerLevel,
      //     });
      //     // Add to "today" the rating. (This is because in another calls to the api
      //     // we may want to know the most hot rated albums of the day)
      //     album.numberOfReviewsEachDay = album.numberOfReviewsEachDay
      //       ? numberReviewsDay.add(album.numberOfReviewsEachDay)
      //       : [{ date: Date.now(), sum: 0 }];
      //   } else {
      //     // else replace
      //     album.ratings.splice(index, 1, {
      //       puntuation: req.body.puntuation,
      //       user: user.username,
      //       powerLevel: user.powerLevel,
      //     });
      //     // // Substract from the last day that the album received a rating.
      //     // album.numberOfReviewsEachDay = album.numberOfReviewsEachDay
      //     //   ? numberReviewsDay.substract(album.numberOfReviewsEachDay)
      //     //   : [{ date: Date.now(), sum: 0 }];
      //   }
      //   const indexUser = user.ratedAlbums.indexOf(req.params.albumid);
      //   if (indexUser <= -1) user.ratedAlbums.push(req.params.albumid);
      //   const userProfile = await user.save();
      //   delete userProfile.password;
      //   Activity.addSomethingActivity(
      //     Activity.createRatedInformation(
      //       {
      //         _id: album._id,
      //         name: `${album.name} by ${album.artist}`,
      //         score: req.body.puntuation,
      //         pathname: `/album/${album.artist}/${album.name}/${album.mbid}`,
      //       },
      //       { userId: req.user.id, username: req.user.username },
      //     ),
      //   );
      //   return album
      //     .save()
      //     .then(res_ =>
      //       res.json({
      //         ratings: res_.ratings,
      //         __v: res_.__v,
      //         user: userProfile,
      //       }),
      //     )
      //     .catch(err => console.log(err));
      // }
      // return res.status(400).json('Error finding the album.');
    } catch (err) {
      console.log(err);
      return res.status(404).json('Error.');
    }
  },
);

router.delete(
  '/rate/:albumID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { user, params } = req;
      const { albumID } = params;
      const album = await Album.findById(albumID);
      if (!album) {
        return res.status(404).json({ error: 'Album not found.' });
      }
      album.ratings = album.ratings.filter(
        rating => String(rating.user) !== user.username,
      );
      const albumSaved = await album.save();
      user.ratedAlbums = user.ratedAlbums.filter(
        album => String(album) !== albumID,
      );
      user.save();
      res.json({ ratings: albumSaved.ratings, user });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: 'Error requesting an album.' });
    }
  },
);

// @GET
// TODO This should be a POST request please.
// @OPTIONALQUERYPARAMS username, userId, mbid
router.get('/:albumname/:artistname', async (req, res) => {
  const { lastfm, username = '', userId, mbid = 'null' } = req.query;
  const isMbid = mbid => mbid === 'null' || mbid === '' || mbid.includes('-');
  const isIdMbid = isMbid(mbid);
  if (!isIdMbid) {
    const [err, album] = await handleError(
      albumHelper.getAlbumViaMbid(mbid, lastfm, FM, userId, username),
    );
    if (!album) return res.status(404).json({ error: 'Album not found.' });
    if (err) {
      return res.status(400).json({ error: err });
    }
    return res.json({ album });
  }

  const AlbumDataForLastFM = {
    albumname: req.params.albumname,
    username: lastfm,
    artist: req.params.artistname,
    mbid,
  };
  // eslint-disable-next-line prefer-const
  let [errFM, albumFM] = await handleError(FM.getAlbum(AlbumDataForLastFM));
  if (errFM) {
    console.log(errFM);
    return res.status(400).json({ error: 'Error requesting album' });
  }

  if (albumFM && albumFM.album) {
    albumFM = albumFM.album;
    let albumDB = await Album.findOne({
      artist: albumFM.artist,
      name: albumFM.name,
    });
    if (!albumDB) {
      const newAlbum = new Album({
        artist: albumFM.artist,
        name: albumFM.name,
        mbid: albumFM.mbid,
        lastfmSource: true,
      });
      const saved = await newAlbum.save();
      albumDB = saved;
    }

    if (!albumDB.lastfmSource) {
      albumDB.lastfmSource = true;
      dontCareWaitingForSave(albumDB, false);
    }
    // albumFM.ratings = albumDB.ratings;
    // albumFM.album.score = Chart.averageWithPowerLevel(albumDB.ratings);
    albumFM.userScore =
      (username &&
        (
          albumDB.ratings.filter(r => String(r.user) === String(username))[0] ||
          {}
        ).puntuation) ||
      0;
    albumFM.reviews = albumDB.reviews;
    albumFM._id = albumDB._id;
    albumFM.__v = albumDB.__v;
    albumFM.images = albumDB.images;
    albumFM.lastfmSource = albumDB.lastfmSource;
    albumFM.liked = !!(albumDB.usersLiked ? albumDB.usersLiked[userId] : false);
    albumFM.artistId = albumDB.artistId;
    albumFM.score = averageWithPowerLevel(albumDB.ratings);
    return res.json({ album: albumFM });
  }
  const album = await Album.findOne({
    name: req.params.albumname,
    artist: req.params.artistname,
    _id: mbid,
    lastfmSource: false,
  });
  if (!album) {
    return res.status(404).json('Album not found!');
  }
  return res.json({ album });
});

/**
 * @POST
 * @description Posts a loved.
 */
router.post(
  '/loved/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { params, user } = req;
    const { id } = params;
    delete user.password;
    if (id === null || id === 'null' || !id)
      return res.status(400).json({ error: 'Bad id for Album.' });
    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({ error: 'Error, album not found.' });
    }
    // Initialize objects for late models that don't have this param.
    if (!user.likedAlbums) user.likedAlbums = {};
    if (!album.usersLiked) album.usersLiked = {};
    let updatedUser = null;
    if (user.likedAlbums[id] === undefined || user.likedAlbums[id] === null) {
      user.likedAlbums[id] = {
        album: album._id,
        name: album.name,
        artist: album.artist,
        mbid: album.mbid || null,
      };
      updatedUser = User.updateOne(
        { _id: user._id },
        {
          $set: {
            [`likedAlbums.${album._id}`]: {
              album: album._id,
              name: album.name,
              artist: album.artist,
              mbid: album.mbid || null,
            },
          },
        },
      );
    } else {
      user.likedAlbums[id] = null;
      updatedUser = User.updateOne(
        { _id: user._id },
        {
          $set: {
            [`likedAlbums.${album._id}`]: null,
          },
        },
      );
    }
    let updatedAlbum = null;

    if (
      album.usersLiked[user._id] === null ||
      album.usersLiked[user._id] === undefined
    ) {
      album.usersLiked[user._id] = {
        user: user._id,
        username: user.username,
      };
      updatedAlbum = Album.updateOne(
        { _id: album._id },
        {
          $set: {
            [`usersLiked.${user._id}`]: {
              user: user._id,
              username: user.username,
            },
          },
        },
      );
    } else {
      album.usersLiked[user._id] = null;
      updatedAlbum = Album.updateOne(
        { _id: album._id },
        {
          $set: {
            [`usersLiked.${user._id}`]: null,
          },
        },
      );
    }
    res.json({ album: !!album.usersLiked[user._id] });
    const [err, [userSaved, albumSaved]] = await handleError(
      Promise.all([updatedAlbum, updatedUser]),
    );
    return [userSaved, albumSaved];
  },
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
    const [error, album] = await handleError(Album.findById(id));
    if (error) {
      return res.status(404).json({ error: 'Album not found.' });
    }
    const comment = new CommentSchema(req.user.id, username, text);
    const [errorReturn, returner] = await handleError(
      Comment.postComment(album, comment),
    );

    if (errorReturn) {
      return res.status(500).json({ error: 'Error with the server.' });
    }

    res.json({ comments: returner });
  },
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
      'dislikes',
    );

    res.json({ comments: [...obj.instanceSaved.comments] });
  },
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
      'likes',
    );

    res.json({ comments: [...obj.instanceSaved.comments] });
  },
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
  },
);

router.get('/test/album/:text', async (req, res) => {
  const a = await Album.find({
    ...mongoQueries.find.album.getAlbumSearch(req.params.text),
    lastfmSource: true,
  });

  res.json({ albums: a });
});

router.get('/epic/deep/copy', async (req, res) => {
  const albums = await Album.find().limit(20);
  const response = await new Promise(async res => {
    const albums12 = [];
    for (const album of albums) {
      const albumFM = FM.getAlbum({
        artist: album.artist,
        albumname: album.name,
        mbid: album.mbid,
      });
      albums12.push(albumFM);
    }
    const albumsEnd = Promise.all(albums12);
    res(albumsEnd);
  });
  return res.json({
    lol: response,
  });
});

module.exports = router;
