const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const User = require('../models/User');
const key = require('../config/keys').keyOrSecret;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // Get the user that's being sent on the model
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
