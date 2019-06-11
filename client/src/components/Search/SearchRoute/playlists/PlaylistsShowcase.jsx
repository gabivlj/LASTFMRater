import React from 'react'
import PropTypes from 'prop-types';
import Playlist from './Playlist';

function PlaylistsShowcase({ playlists }) {
  let show = null;

  if (playlists && Array.isArray(playlists)) {
    show = playlists.map(playlist => <div key={playlist._id} className="col-md-4 m-3"><Playlist playlist={playlist} /></div>);
  }
  
  return (
    <div className="row">
      { show }
    </div>
  )
}

PlaylistsShowcase.propTypes= {
  playlists: PropTypes.array.isRequired,
}

export default PlaylistsShowcase;