const router = require('express').Router()
const Album = require('../models/Album')
const Lastfm = require('../classes/Lastfm')

const FM = new Lastfm(null)

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
        .then(saved => res.json(saved))
        .catch(err => res.status(404).json('Errors have been made'))
    } else {
      res.json(album)
    }
  } catch (err) {
    res.status(400).json('INTERNAL ERROR')
  }
})

// @GET
// @OPTIONALQUERYPARAMS username
router.get('/:albumname/:artistname', async (req, res) => {
  const username = req.query.username

  const AlbumData = {
    albumname: req.params.albumname,
    username,
    artist: req.params.artistname
  }
  let album__ = await FM.getAlbum(AlbumData)
  if (album__) {
    album__ = album__.album
    if (album__.tracks.track.length <= 0) {
      // Find Album Tracks in our database incase we have them...
      const tracks = await Album.findOne({
        artist: album__.artist,
        name: album__.name
      }).tracks
      if (tracks && tracks.length > 0) {
        album__.tracks = tracks
      }
      console.log('yes')
    }
    return res.json({ album: album__ })
  } else {
    console.log('n')
    const album = await Album.findOne({
      name: req.params.albumname,
      artist: req.params.artistname
    })
    if (!album) {
      return res.status(400).json('Album not found!')
    }
    return res.json({ album: album })
  }
})

/**
 * @POST
 * @PRIVATE
 * @DESCRIPTION Try to add a rating to the album with the user id, if it does already exist just update it.
 */

router.post('/rate/:albumid', async (req, res) => {
  try {
    const album = await Album.findOne({
      _id: req.params.albumid
    })
    if (album) {
      const index = album.ratings
        .map(rating => rating.user)
        .indexOf(req.body.userid)
      if (index <= -1) {
        album.ratings.push({
          puntuation: req.body.puntuation,
          user: req.body.userid
        })
      } else {
        album.ratings.splice(index, 1, {
          puntuation: req.body.puntuation,
          user: req.body.userid
        })
      }
      album
        .save()
        .then(res_ => res.json(res_))
        .catch(err => console.log(err))
    } else {
      return res.status(400).json('Error finding the album.')
    }
  } catch (err) {
    return res.status(400).json('Error .')
  }
})

/**
 * @POST
 * @PRIVATE
 * @DESCRIPTION Try to add a review, if it already exists just don't add it.
 */

router.post('/review/:albumid', (req, res) => {})
module.exports = router
