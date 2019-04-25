import React from 'react';
import TrackCard from '../visuals/TrackCard';
import './currentTracks.styles.css';
import PropTypes from 'prop-types';

const propTypes = {
  tracks: PropTypes.array.isRequired,
  deleteTrack: PropTypes.func.isRequired,
};

const CurrentTracks = ({ tracks, deleteTrack, ...props }) => (
  <div className="row currentracks">
    {tracks.map((track, index) => (
      <TrackCard
        className="col-md-3 m-2"
        key={index}
        artist={track.artist}
        title={track.name}
        img={
          track.image[3]['#text'] ||
          'https://www.mompetit.com/wp-content/themes/holalady/img/img_placeholder.png'
        }
        onClick={id => deleteTrack(id)}
        mbid={track._id}
      />
    ))}
  </div>
);

CurrentTracks.propTypes = propTypes;

export default CurrentTracks;
