const User = require('../models/User');
const mongo = require('./mongoQueries');

/**
 * @description When the user doesn't follow anyone, this is a good option.
 */
function getRecommendedUsers(
  user,
  recommendedExclude,
  objectExclude,
  userFollowing,
) {
  return new Promise(async (res, reject) => {
    try {
      const likedAlbumsKeys = Object.keys(user.likedAlbums);
      const lenLikedAlbums = likedAlbumsKeys.length;

      if (recommendedExclude.recommended.length === 0 && lenLikedAlbums === 0) {
        // find only by popular users...
        return res(await User.aggregate(mongo.aggregations.user.mostPopular()));
      }
      if (lenLikedAlbums > 0) {
        const albumIDS = likedAlbumsKeys.filter(
          k => user.likedAlbums[k] != null,
        );
        if (albumIDS.length) {
          const recommendedUsers = await User.aggregate(
            mongo.aggregations.user.getUsersThatCoincideInLikes(albumIDS, {
              images: 1,
              username: 1,
              followerCount: 1,
            }),
          ).sort({ followerCount: 1 });
          const finalRecommended = recommendedUsers
            .filter(
              u =>
                String(u._id) !== String(user._id) &&
                !objectExclude[String(user._id)] &&
                !userFollowing[u._id],
            )
            .slice(0, 3);
          return res(finalRecommended);
        }
      }
      return res(await User.aggregate(mongo.aggregations.user.mostPopular()));
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
}

module.exports = getRecommendedUsers;
