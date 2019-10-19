// Libraries
const express = require('express');
const passport = require('passport');
const path = require('path');
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
const following = require('./routes/following');
const chat = require('./routes/chat');
const review = require('./routes/review');
const { addRoutes } = require('./lib/routes');
const passportConfig = require('./config/passport');

const app = express();

const DEV = false;

// Database connection
mongoose.connect(db, { useNewUrlParser: true }, err => {
  if (err) throw err;
  console.log(
    `Connected to database! Welcome 🐋: ${db.split(':')[1].slice(2)} 🐋`,
  );
});

if (DEV) {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// BodyParser Init.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.disable('x-powered-by');

passportConfig(passport);

// Route for Lastfm (test)
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
  ['/api/comments', comments],
  ['/api/following', following],
  ['/api/chat', chat],
  ['/api/reviews', review],
);

// Port listening
const PORT = process.env.PORT || 8000;
app.listen(PORT, err =>
  err
    ? console.log(err)
    : console.log(`🐋  Grampy localhost:${PORT} Connected! 🐋`),
);
