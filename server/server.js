// Libraries
const passport = require('passport');
const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Mongodb Key
const db = require('./config/keys').MONGOURI;
// Routes
const album = require('./routes/album');
const user = require('./routes/user');
const artist = require('./routes/artist');
const playlist = require('./routes/playlist');
const track = require('./routes/track');

const passportConfig = require('./config/passport');

// Database connection
mongoose.connect(db, { useNewUrlParser: true }, err => {
  if (err) throw err;
  console.log(`Connected to database! Welcome: ${db.split(':')[1].slice(2)}`);
});

// BodyParser Init.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

// Route for auth. Lastfm
app.get('/api/token', (req, res) => {
  const { token } = req.query;
  res.redirect(`http://localhost:3000/${token}`);
});

// Use routes
app.use('/api/album', album);
app.use('/api/user', user);
app.use('/api/artist', artist);
app.use('/api/playlist', playlist);
app.use('/api/track', track);

// Port listening
const PORT = process.env.PORT || 8000;
app.listen(PORT, err =>
  err ? console.log(err) : console.log('Port connected')
);
