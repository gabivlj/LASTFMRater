const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Lastfm = require('../classes/Lastfm');
const Authenticator = require('../classes/Authenticator');
const secret = require('../config/keys').keyOrSecret;

const FM = new Lastfm();

router.get('/godmode', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => console.log(err));
});

router.get(
  '/info',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const listOfFriends = user.followedAccounts.filter(followed =>
      user.followers.includes(String(followed)),
    );
    res.json({
      email: user.email,
      lastfm: user.lastfm,
      id: user._id,
      ratedAlbums: user.ratedAlbums,
      reviews: user.reviews,
      playlists: user.playlists,
      followedAccounts: user.followedAccounts,
      profileImage: user.img,
      followers: user.followers || 0,
      listOfFriends,
    });
  },
);

router.post(
  '/lastfm/:username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json('Invalid credentials');
      const user = await User.findOne({ username: req.params.username });
      if (user) {
        user.lastfm = name;
        const userFinal = await user.save();
        delete userFinal.password;
        res.json(userFinal);
      } else {
        res.status(400).json({ error: 'Error finding user' });
      }
    } catch (err) {
      res.status(400).json('Error processing');
    }
  },
);

router.post(
  '/image',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const { img } = '';
    if (!img) {
      return res
        .status(400)
        .json({ error: 'Image link is needed for the request.' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found ' });
    }
    user.img = img;
    user.save();
    return res.json({ success: true });
  },
);

router.post('/rate', async (req, res) => {
  try {
    const { userid, albumId } = req.body;
    const user = await User.findOne({ _id: userid });
    if (user) {
      const index = user.ratedAlbums.indexOf(albumId);
      if (index <= -1) user.ratedAlbums.push(albumId);
      user.save().then(usr => res.json(usr));
    } else {
      res.status(400).json('User not found.');
    }
  } catch (err) {
    res.status(400).json('Error processing');
  }
});

router.get('/artists/:username', async (req, res) => {
  FM.getUsersArtist(req.params.username)
    .then(artists => res.json(artists))
    .catch(err => res.status(404).json(`Error at ${err}`));
});

router.post(
  '/:token',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user_ = await User.findOne({ username: req.body.username });
    if (!user_) {
      res.status(404).json({ error: 'User not found' });
    }

    FM.setUser(req.params.token)
      .then(user => {
        res.json(user);
      })
      .catch(err => res.status(500).json('ERROR WITH API'));
  },
);

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { isValid, errors } = Authenticator.AuthenticateUserInputLogin(
    req.body,
  );

  if (!isValid) {
    return res.status(400).json({ errors });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      errors.auth = 'Invalid credentials.';
      return res.status(400).json({ errors });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.auth = 'Invalid credentials';
      return res.status(400).json({ errors });
    }
    jwt.sign(
      {
        email,
        user: user.username,
        lastfm: user.lastfm,
        // todo: delete all of this to be honest, we just gonna put this to a profile schema or something.
        id: user.id,
        ratedAlbums: user.ratedAlbums,
        reviews: user.reviews,
        playlists: user.playlists,
        followedAccounts: user.followedAccounts,
      },
      secret,
      { expiresIn: 4800 },
      (err, token) => res.json({ token: `Bearer ${token}`, success: true }),
    );
  } catch (err) {
    console.log(err);
    return res.status(401).json({ errors: err, message: 'Unknown accident!' });
  }
});

router.post('/auth/register', async (req, res) => {
  const { email, password, password2, username } = req.body;
  // Input check
  const { isValid, errors } = Authenticator.AuthenticateUserInputRegister(
    req.body,
  );
  // If it is invalid, return 400
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // Start auth
  try {
    // We try to find a user that meets email or username
    const doesUserExists = await User.findOne({
      $or: [{ email }, { username }],
    });
    // Check if it does exist
    if (!Authenticator.isEmpty(doesUserExists)) {
      errors.exist = 'This user already exists.';
      return res.status(400).json(errors);
    }
    // We generate the salt
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, encrypted) => {
        try {
          const user = new User({
            email,
            password: encrypted,
            username,
            ratedAlbums: [],
            lastfm: null,
            reviews: [],
            followedAccounts: [],
            followers: [],
            playlists: [],
          });
          const userS = await user.save();
          return res.json(userS);
        } catch (err) {
          console.log(err);
          return res
            .status(401)
            .json({ auth: 'Error with authentification', err });
        }
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: err, message: 'Unknown accident!' });
  }
});

module.exports = router;
