const Album = require('../models/Album');

const albumHelper = {
  mapLikesDislikes: comments =>
    comments.map(comment => ({
      ...comment,
      likes: comment.likes ? comment.likes.length : 0,
      dislikes: comment.dislikes ? comment.dislikes.length : 0,
    })),
  getIfUserLikedOrNot: (comments, userId) => {
    const commentsMod = comments.map(comment => {
      const likes = comment.likes.map(like => String(like.user));
      const dislikes = comment.dislikes.map(dislike => String(dislike.user));
      if (likes.indexOf(String(userId)) > -1) {
        comment.liked = true;
      }
      if (dislikes.indexOf(String(userId)) > -1) {
        comment.disliked = true;
      }
      return comment;
    });
    return commentsMod;
  },

  getAlbumViaMbid(mbid, username, FM, userId) {
    return new Promise(async (res, reject) => {
      try {
        const album = await Album.findById(mbid);
        const tracksFromAlbum = !!(album.tracks || album.tracks.length);
        if (!album) return reject(new Error('Album not found.'));
        const realMBID = album.mbid;
        if (typeof realMBID !== 'string' || realMBID.length <= 0) {
          return res(album);
        }
        const albumFM = await FM.getAlbum({
          username,
          artist: album.artist,
          albumname: album.name,
          mbid: album.mbid || mbid,
        });
        if (!albumFM || !albumFM.album || albumFM.error) {
          return res(album);
        }
        albumFM.album.ratings = album.ratings;
        albumFM.album.reviews = album.reviews;
        albumFM.album._id = album._id;
        albumFM.album.__v = album.__v;
        albumFM.album.images = album.images;
        albumFM.album.lastfmSource = album.lastfmSource;
        albumFM.album.liked = !!(album.usersLiked
          ? album.usersLiked[userId]
          : false);
        if (albumFM.album.tracks.track.length === 0 && tracksFromAlbum) {
          albumFM.album.tracks.track = tracksFromAlbum;
        }
        return res(albumFM.album);
      } catch (err) {
        return reject(err);
      }
    });
  },
};

module.exports = albumHelper;
