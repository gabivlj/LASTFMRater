const router = require('express').Router()
const Artist = require('../models/Artist')
const Lastfm = require('../classes/Lastfm')
const fm = new Lastfm(null)

router.get('/search/:name', async (req, res) => {
  try {
    const artists = await Artist.find({ name: req.params.name })
    if (!artists || artists.length <= 0) {
      // Find with lastfm api.
      const artists__ = await fm.searchArtists(name)
      return res.json(artists__)
    }
    return res.json(artists)
  } catch (err) {
    res.status(400).json('Error searching artists')
  }
})

router.get('/:name', async (req, res) => {
  try {
    const artist =
      (await Artist.findOne({ name })) || (await fm.getArtist(req.params.name))
    return res.json(artist)
  } catch (err) {
    res.status(400).json('Error finding artist')
  }
})
module.exports = router
