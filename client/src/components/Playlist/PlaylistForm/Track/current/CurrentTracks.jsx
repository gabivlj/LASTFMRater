import React from 'react'
import TrackCard from '../visuals/TrackCard'
import './currentTracks.styles.css'
const CurrentTracks = ({ tracks, deleteTrack, ...props }) => {
  return (
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
  )
}

export default CurrentTracks
