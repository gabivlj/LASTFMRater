const passport = require('passport');
const router = require('express').Router();
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Lastfm = require('../classes/Lastfm');
const acceptNewItem = require('../lib/acceptNewItem');

const fm = new Lastfm(null);

const time = () => {
  const startTime = new Date();
  return s => {
    console.log(new Date() - startTime);
    return time();
  };
};

router.get('/search/:name', async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    const { name } = req.params;
    // let artists = await Artist.find({ name: req.params.name });
    // if (!artists || artists.length <= 0) {
    const artists__ = await fm.searchArtists(name, limit, page);
    return res.json(artists__);
    // }
    // artists = [...artists, ...(await fm.searchArtists(name, limit, page))];
    // return res.json(artists.slice(0, limit));
  } catch (err) {
    res.status(400).json('Error searching artists.');
  }
});

router.get('/:name', async (req, res) => {
  try {
    const { artistId = 'null' } = req.query;
    if (
      artistId.includes('-') ||
      artistId === 'null' ||
      !artistId ||
      artistId === 'undefined'
    ) {
      const fmArtist = await fm.getArtist(req.params.name, artistId);
      if (!fmArtist.error) {
        let artist = await Artist.findOne({
          name: req.params.name,
          mbid: fmArtist.artist.mbid,
        });
        console.log(artist);
        if (!artist) {
          const dbArtist = new Artist({
            name: req.params.name,
            mbid: fmArtist.artist.mbid,
            notProcessed: false,
          });
          artist = await dbArtist.save();
          // TEMPORAL FUNCTION
          const albums = await Album.find({ artist: artist.name });
          albums.forEach(album => {
            // eslint-disable-next-line no-param-reassign
            album.artistId = artist._id;
            album.save();
          });
        }
        fmArtist.artist.images = artist.images || [];
        fmArtist.artist.networks = artist.networks || {};
        fmArtist.artist._id = artist._id;
        fmArtist.artist.__v = artist.__v;
        return res.json(fmArtist);
      }
    }
    const artist = await Artist.findOne({ _id: artistId });
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found.' });
    }
    const fmArtist = await fm.getArtist(req.params.name, artist.mbid);
    if (!fmArtist.error) {
      fmArtist.artist.images = artist.images || [];
      fmArtist.artist.networks = artist.networks || {};
      fmArtist.artist._id = artist._id;
      fmArtist.artist.__v = artist.__v;
      return res.json(fmArtist);
    }
    return res.json({ artist, notLastfm: true });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

router.get('/albums/:name', async (req, res) => {
  try {
    const albums =
      (await fm.getArtistAlbums(req.params.name)) ||
      (await Album.find({ artist: req.params.name }));
    res.json(albums);
  } catch (err) {
    res.status(400).json('Error finding albums from the artist.');
  }
});

router.post(
  '/new/album',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const {
        dateOfBirth,
        images = [],
        description = '',
        genres = [],
        networks = {},
        grampyAccount,
        name,
      } = req.body;
      let grampy = null;
      const date = new Date(dateOfBirth);
      if (
        name == null ||
        typeof name !== 'string' ||
        name === 'null' ||
        name === 'undefined' ||
        name.trim() === ''
      ) {
        return res.status(400).json({ error: 'Name is required!' });
      }
      if (grampyAccount === 'YES') {
        grampy = req.user.username;
      }
      const artist = new Artist({
        dateOfBirth: date,
        images,
        description,
        grampyAccount: grampy,
        genres,
        networks: {
          twitter: '',
          spotify: '',
          itunes: '',
          facebook: '',
          instagram: '',
          youtube: '',
          soundcloud: '',
          ...JSON.parse(networks),
        },
        name,
      });
      const artistSaved = await artist.save();
      return res.json({ artist: artistSaved });
    } catch (err) {
      console.log(err);
      return res.status(404).json({ error: 'Error with the submiting!' });
    }
  },
);

router.post(
  '/approve/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user, params } = req;
    if (user.username === 'gabivlj3') user.admin = true;
    if (!user.admin) {
      return res.status(400).json({ error: 'Not an admin!' });
    }
    const [right, err] = await acceptNewItem('ARTIST', params.id);
    if (!right) {
      console.log(err);
      return res.status(404).json({ error: 'Error updating album.' });
    }
    return res.json({ success: right });
  },
);

router.post(
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { body } = req;
    const [item, err] = await acceptNewItem(
      'UPD_REQ_ARTIST',
      req.params.id,
      '',
      body,
    );
    res.json({ artist: item, error: err });
  },
);

router.post(
  '/accept_update/:id/:specificId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const { id, specificId } = req.params;
    if (user.username === 'gabivlj3') user.admin = true;
    const [item, err] = await acceptNewItem(
      'UPDATE_ARTIST',
      id,
      specificId,
      {},
    );
    res.json({ artist: item, error: err });
  },
);

module.exports = router;
