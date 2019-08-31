module.exports = {
  aggregations: {
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
