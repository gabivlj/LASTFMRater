const request = require('request')
const app = require('express')()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/token', (req, res) => {
  const token = req.query['token']
  res.redirect(`http://localhost:3000/${token}`)
})

const PORT = process.env.PORT || 8000
app.listen(PORT, err =>
  err ? console.log(err) : console.log('Port connected')
)
