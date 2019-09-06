const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const mongoQueries = {
  aggregations: {
    user: {
      /**
       * @description gets the users that liked the album
       */
      getUsersAlbum: id => [
        {
          $match: { _id: ObjectId(id) },
        },
        {
          $project: {
            usersLikedArray: { $objectToArray: '$usersLiked' },
          },
        },
        { $unwind: '$usersLikedArray' },
        {
          $lookup: {
            from: 'users',
            localField: 'usersLikedArray.v.username',
            foreignField: 'username',
            as: 'user',
          },
        },
        {
          $group: {
            _id: '$_id',
            usersLikedArray: {
              $push: {
                user: { $arrayElemAt: ['$user._id', 0] },
                username: { $arrayElemAt: ['$user.username', 0] },
                ratedAlbums: { $arrayElemAt: ['$user.ratedAlbums', 0] },
                likedAlbums: { $arrayElemAt: ['$user.likedAlbums', 0] },
              },
            },
          },
        },
      ],
      /**
       * @description Gets the 3 most prestigious users of an album.
       */
      getMostPrestigiousUsers(id = null, $match = null) {
        return [
          ...($match || mongoQueries.aggregations.user.getUsersAlbum(id)),
          {
            $project: {
              _id: 0,
              loved: {
                $map: {
                  input: '$usersLikedArray',
                  as: 'user',
                  in: {
                    numberOfLoved: {
                      $add: [
                        {
                          $cond: [
                            {
                              $isArray: '$$user.ratedAlbums',
                            },
                            { $size: '$$user.ratedAlbums' },
                            0,
                          ],
                        },
                        {
                          $cond: [
                            {
                              $isArray: '$$user.ratedAlbums',
                            },
                            { $size: { $objectToArray: '$$user.likedAlbums' } },
                            0,
                          ],
                        },
                      ],
                    },
                    user: '$$user.user',
                    username: '$$user.username',
                    likedAlbums: { $objectToArray: '$$user.likedAlbums' },
                  },
                },
              },
            },
          },
          { $unwind: '$loved' },
          {
            $sort: { 'loved.numberOfLoved': -1 },
          },
          {
            $group: { _id: '$_id', users: { $push: '$loved' } },
          },
          {
            $project: {
              _id: 0,
              users: { $slice: ['$users', 0, 3] },
            },
          },
        ];
      },
    },
    playlist: {
      /**
       * @description Makes average of a playlist. (AGGREGATION)
       * @param {Object}, Whatever additional call you wanna make before the averaging of the playlist.
       */
      makeAverage: (reg = null) => [
        ...([reg] || []),
        {
          $project: {
            ratingLength: {
              $cond: {
                if: { $isArray: '$ratings' },
                then: { $size: '$ratings' },
                else: 0,
              },
            },
            playlistName: 1,
            tracks: 1,
            playlistDescription: 1,
            user: 1,
            ratings: 1,
          },
        },
        {
          $project: {
            averageScore: {
              $cond: {
                if: { $gt: ['$ratingLength', 1] },
                then: { $avg: '$ratings.puntuation' },
                else: 0,
              },
            },
            ratingLength: 1,
            playlistName: 1,
            tracks: 1,
            playlistDescription: 1,
            user: 1,
          },
        },
      ],
    },
  },
};

module.exports = mongoQueries;
