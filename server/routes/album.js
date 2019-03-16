const router = require('express').Router()
const Album = require('../models/Album')

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
    })
    if (!album) {
      const newAlbum = new Album({
        name: req.body.albumname,
        artist: req.body.artist,
        mbid: req.body.mbid
      })
      newAlbum
        .save()
        .then(res => res.json(res))
        .catch(err => res.status(404).json('Errors have been made'))
    } else {
      res.json(album)
    }
  } catch (err) {
    res.status(400).json('INTERNAL ERROR')
  }
})

/**
 * @POST
 * @PRIVATE
 * @DESCRIPTION Try to add a rating to the album with the user id, if it does already exist just update it.
 */

router.post('/rate/:albumid', (req, res) => {})

/**
 * @POST
 * @PRIVATE
 * @DESCRIPTION Try to add a review, if it already exists just don't add it.
 */

router.post('/review/:albumid', (req, res) => {})
module.exports = router
