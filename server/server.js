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
const profile = require('./routes/profile');
const comments = require('./routes/commentSection');

const { addRoutes } = require('./lib/routes');

const passportConfig = require('./config/passport');

// Database connection
mongoose.connect(db, { useNewUrlParser: true }, err => {
  if (err) throw err;
  console.log(`Connected to database! Welcome: ${db.split(':')[1].slice(2)}`);
});

// BodyParser Init.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Passport init
app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

// Route for auth. Lastfm
app.get('/api/token', (req, res) => {
  const { token } = req.query;
  res.redirect(`http://localhost:3000/${token}`);
});

// Use routes
addRoutes(
  app,
  ['/api/album', album],
  ['/api/user', user],
  ['/api/artist', artist],
  ['/api/playlist', playlist],
  ['/api/track', track],
  ['/api/profile', profile],
  ['/api/comments', comments]
);

// Port listening
const PORT = process.env.PORT || 8000;
app.listen(PORT, err =>
  err ? console.log(err) : console.log('Port connected')
);
