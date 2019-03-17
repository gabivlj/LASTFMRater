const router = require('express').Router()
const User = require('../models/User')

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

module.exports = router
