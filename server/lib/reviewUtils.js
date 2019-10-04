module.exports = {
  mapAllReviewsToPuntuations: (reviews, album) => {
    if (!album) {
      return reviews;
    }
    const mappedPuntuations = album.ratings.reduce((prev, now) => {
      prev[now.user] = now.puntuation || -1;
      return prev;
    }, {});
    for (const review of reviews) {
      review.puntuation = mappedPuntuations[review.username] || -1;
      delete review.albums;
    }
    return reviews;
  },
  getPuntuationFromObject: (username, reviewObject) => {
    let puntuation = -1;
    if (reviewObject) {
      const ratingsFiltered = reviewObject.ratings.filter(
        rating => rating.user === username,
      );
      puntuation =
        ratingsFiltered.length > 0 ? ratingsFiltered[0].puntuation : -1;
    }
    return puntuation;
  },
};
