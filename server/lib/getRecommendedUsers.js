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
      const likedAlbumsKeys = user.likedAlbums
        ? Object.keys(user.likedAlbums)
        : {};
      const lenLikedAlbums = likedAlbumsKeys.length;
      console.log(`len${lenLikedAlbums}`);
      if (recommendedExclude.recommended.length === 0 && lenLikedAlbums === 0) {
        // find only by popular users...
        return res(
          await User.aggregate(mongo.aggregations.user.mostPopular())
            .sort({ totalScore: -1 })
            .limit(3),
        );
      }
      if (lenLikedAlbums > 0) {
        const albumIDS = likedAlbumsKeys.filter(
          k => user.likedAlbums[k] != null,
        );
        if (albumIDS.length) {
          const recommendedUsers = await User.aggregate(
            mongo.aggregations.user.getUsersThatCoincideInLikes(albumIDS),
          )
            .sort({ followerCount: -1 })
            .limit(20);
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
      return res(
        await User.aggregate(mongo.aggregations.user.mostPopular())
          .sort({ totalScore: -1 })
          .limit(3),
      );
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
}

module.exports = getRecommendedUsers;
