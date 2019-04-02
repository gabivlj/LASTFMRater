const router = require('express').Router()
const Artist = require('../models/Artist')
const Album = require('../models/Album')
const Lastfm = require('../classes/Lastfm')
const fm = new Lastfm(null)

router.get('/search/:name', async (req, res) => {
  try {
    const limit = req.query.limit || 5
    const page = req.query.page || 1
    const { name } = req.params
    let artists = await Artist.find({ name: req.params.name })
    if (!artists || artists.length <= 0) {
      const artists__ = await fm.searchArtists(name, limit, page)
      return res.json(artists__)
    }
    artists = [...artists, ...(await fm.searchArtists(name, limit, page))]
    return res.json(artists.slice(0, limit))
  } catch (err) {
    res.status(400).json('Error searching artists.')
  }
})

router.get('/:name', async (req, res) => {
  try {
    const artist = await Artist.findOne({ name: req.params.name })
    if (!artist) {
      const __ = await fm.getArtist(req.params.name)
      return res.json(__)
    }
    return res.json(artist)
  } catch (err) {
    res.status(400).json(err)
  }
})

router.get('/albums/:name', async (req, res) => {
  try {
    const albums =
      (await fm.getArtistAlbums(req.params.name)) ||
      (await Album.find({ artist: req.params.name }))
    res.json(albums)
  } catch (err) {
    res.status(400).json('Error finding albums from the artist.')
  }
})

module.exports = router
