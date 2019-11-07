/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
const Albums = require('../models/Album');
const User = require('../models/User');
const Review = require('../models/Review');

const configPowerLevels = {
  eachReview: 0.01,
  eachRating: 0.005,
  eachPlaylist: 0.01,
};

function averageWithPowerLevel(array) {
  let len = 0;
  const total = array.reduce((prev, now) => {
    len += now.powerLevel;
    return prev + now.puntuation * now.powerLevel;
  }, 0);
  return isNaN(total / len) ? 0 : total / len;
}

async function calculatePowerLevels(users) {
  const promises = [];
  for (const user of users) {
    promises.push(ChartPL.CalculatePowerLevel(user));
  }
  const usersEnd = await Promise.all(promises);
  usersEnd.forEach(u => u.save());
  return users;
}
/**
 * @description Handles power levels and charts
 */
class ChartPL {
  /**
   * @description Temporal function to update albums puntuations to the new power level system.
   */
  static async UpdateEveryAlbumPuntuationArray() {
    const albums = await Albums.find();
    albums.forEach(album => {
      album.ratings.forEach(r => {
        User.findOne({ username: r.user }).then(u => {
          if (u == null) return console.log(r.user);
          r.powerLevel = u.powerLevel;
        });
      });
    });
    setTimeout(() => {
      albums.forEach(a => a.save());
      console.log(albums.map(album => album.ratings));
    }, 2000);
  }

  static async CalculatePowerLevel(user) {
    const reviewsFromUser = await Review.find({ userID: user._id });
    const sumOfReviews = reviewsFromUser.length * 0.1; // configPowerLevels.eachReview;
    const sumOfRatings = user.ratedAlbums.length * 0.1; // configPowerLevels.eachRating;
    const sumOfPlaylists =
      user.playlists.length * configPowerLevels.eachPlaylist;
    const sum = Math.floor(sumOfPlaylists + sumOfRatings + sumOfReviews);
    user.powerLevel = Math.max(1, sum);
    console.log(`${user.username}'s Power Level: ${user.powerLevel}`);
    return user;
  }

  static async UpdateAlbumsScore() {
    try {
      const albums = await Albums.find();
      albums.forEach(album => {
        album.score = averageWithPowerLevel(album.ratings);
        console.log(
          `New Score: ${album.score}. Old score: ${album.ratings.reduce(
            (prev, now) => prev + now.puntuation,
            0,
          ) / album.ratings.length}`,
        );
        album.save();
      });
      return albums;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  static StartProcessingPowerLevels() {
    return new Promise(async (_, reject) => {
      try {
        const users = await User.find();
        calculatePowerLevels(users);
        setInterval(() => {
          calculatePowerLevels(users);
          // a day in ms.
        }, 86400000);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  // static async
}

module.exports = ChartPL;
