const handleError = require('./handleError');
const FM = require('../classes/Lastfm');

const Lastfm = new FM();
/**
 * @param {Number} duration
 * @param {String} name
 * @param {String} artist
 * @param {String} album
 * @param {Schema} Track
 * @description Add track to Track collection if it does not exist Mongodb. If it does do nothing.
 * @returns {TrackSchema}
 */
module.exports = async function addTrack(duration, name, artist, album, Track) {
  return new Promise(async (resolve, reject) => {
    const track = {
      duration,
      name,
      artist,
      album
    };
    const [error, mongoTrack] = await handleError(
      Track.findOne({ name, artist })
    );
    if (error) reject(error);
    if (!mongoTrack) {
      const lastfmTrack = await Lastfm.getTrack(track.name, track.artist);
      track.duration = lastfmTrack.duration;
      track.album = lastfmTrack.album ? lastfmTrack.album.title : 'No album';
      const T = new Track(track);
      const tr = await T.save();
      resolve(tr);
    }
    resolve(mongoTrack);
  });
};
