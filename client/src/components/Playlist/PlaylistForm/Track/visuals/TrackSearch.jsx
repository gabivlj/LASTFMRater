import React from 'react';
import TrackCard from './TrackCard';
import PropTypes from 'prop-types';

const propTypes = {
  tracks: PropTypes.array.isRequired,
  addTrack: PropTypes.func.isRequired
}

const TrackSearch = ({ tracks, addTrack }) => {
  const showTracks = tracks.map((track, index) => (
    <TrackCard
      className="col-md-3 m-2"
      key={index}
      artist={track.artist}
      title={track.name}
      img={
        track.image[3]['#text'] ||
        'https://www.mompetit.com/wp-content/themes/holalady/img/img_placeholder.png'
      }
      mbid={track._id}
      add
      onClick={id => addTrack(track)}
    />
  ));
  return <div className="row">{showTracks}</div>;
};

TrackSearch.propTypes = propTypes;

export default TrackSearch;
