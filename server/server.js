const request = require('request')
const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const db = require('./config/keys').MONGOURI
const album = require('./routes/album')
const user = require('./routes/user')

mongoose.connect(db, { useNewUrlParser: true }, err => {
  console.log('Connected to Mongo Atlas')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/token', (req, res) => {
  const token = req.query['token']
  res.redirect(`http://localhost:3000/${token}`)
})
app.use('/api/album', album)
app.use('/api/user', user)
const PORT = process.env.PORT || 8000
app.listen(PORT, err =>
  err ? console.log(err) : console.log('Port connected')
)
