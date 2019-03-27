const router = require('express').Router()
const User = require('../models/User')
const Lastfm = require('../classes/Lastfm')
const FM = new Lastfm()

router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    const user = await User.findOne({ name })
    if (user) {
      res.json(user)
    } else {
      const newUser = new User({ name })
      newUser.save().then(u => res.json(u))
    }
  } catch (err) {
    res.status(400).json('Error processing')
  }
})

router.post('/rate', async (req, res) => {
  try {
    const { name, albumId } = req.body
    const user = await User.findOne({ name })
    if (user) {
      const index = user.ratedAlbums.indexOf(albumId)
      if (index <= -1) user.ratedAlbums.push(albumId)
      user.save().then(usr => res.json(usr))
    } else {
      res.status(400).json('User not found.')
    }
  } catch (err) {
    res.status(400).json('Error processing')
  }
})

router.get('/artists/:username', async (req, res) => {
  FM.getUsersArtist(req.params.username)
    .then(artists => res.json(artists))
    .catch(err => res.status(404).json('Error at ' + err))
})

router.get('/:token', async (req, res) => {
  FM.setUser(req.params.token)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('ERROR WITH API'))
})

module.exports = router
