const router = require('express').Router();
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Lastfm = require('../classes/Lastfm');

const fm = new Lastfm(null);

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
    console.log(artistId);
    if (
      artistId.includes('-') ||
      artistId === 'null' ||
      !artistId ||
      artistId === 'undefined'
    ) {
      const __ = await fm.getArtist(req.params.name, artistId);
      if (!__.error) {
        let artist = await Artist.findOne({
          name: req.params.name,
          mbid: __.artist.mbid,
        });
        console.log(artist);
        if (!artist) {
          const dbArtist = new Artist({
            name: req.params.name,
            mbid: __.artist.mbid,
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
        __.artist.images = artist.images || [];
        __.artist.networks = artist.networks || {};
        __.artist._id = artist._id;
        __.artist.__v = artist.__v;
        return res.json(__);
      }
    }
    const artist = await Artist.findOne({ _id: artistId });
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found.' });
    }
    const __ = await fm.getArtist(req.params.name, artist.mbid);
    if (!__.error) {
      __.artist.images = artist.images || [];
      __.artist.networks = artist.networks || {};
      __.artist._id = artist._id;
      __.artist.__v = artist.__v;
      return res.json(__);
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

module.exports = router;
