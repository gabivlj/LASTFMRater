// Libraries
const express = require('express');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
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
const opinion = require('./routes/opinion');
const { addRoutes } = require('./lib/routes');
const passportConfig = require('./config/passport');

const app = express();

console.log(process.env.DEVELOPMENT);
const production = !process.env.DEVELOPMENT;

// Database connection
function connect() {
  mongoose.connect(
    db,
    // Anti-deprecation messages
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    err => {
      if (err) {
        console.log(`ERROR: ${err}`);
        console.log('Trying again :P...');
        setTimeout(() => {}, 1000);
        return;
      }
      console.log(
        `Connected to database! Welcome 🐋: ${db.split(':')[1].slice(2)} 🐋`,
      );
    },
  );
}

connect();
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
  ['/api/opinions', opinion],
);

if (production) {
  // TODO: HTTPS.
  // const privateKey = fs.readFileSync('./sslcert/selfsigned.key', 'utf8');
  // const certificate = fs.readFileSync('sslcert/selfsigned.crt', 'utf8');

  // const credentials = { key: privateKey, cert: certificate };

  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const httpsServer = https.createServer({}, app);
const httpServer = http.createServer(app);

// Port listening
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, err =>
  err
    ? console.log(err)
    : console.log(`🐋  Grampy http://localhost:${PORT} Connected! 🐋`),
);

httpsServer.listen(8443, err =>
  err
    ? console.log(err)
    : console.log(`🐋  Grampy secure https://localhost:${8443} Connected! 🐋`),
);
