import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function PlaylistShowcase({ playlists, ...props }) {
  let render;
  if (playlists && playlists.length > 0) {
    render = playlists.map(playlist => 
      <li key={playlist._id} className="list-group-item">
        <Link to={`/playlist/view/${playlist._id}`}>{playlist.playlistName}</Link>
      </li>
    );
  } else if (playlists && playlists.length === 0) {
    render = <h2>You haven't got any playlists yet... <Link to="/playlist/create">Wanna create one?</Link></h2>
  }
  return (
    <div style={{ paddingLeft: '15%'}}>
      <h2>
        Playlists:
      </h2>      
      <ul className="mt-3 mb-3 list-group">
        {render}
      </ul>
      { playlists && playlists.length > 0 ? <Link className="btn btn-primary" to="/playlist/create">Create</Link> : null}
    </div>
  )
};

PlaylistShowcase.propTypes = {
  playlists: PropTypes.array,
}

PlaylistShowcase.defaultProps = {
  playlists: null
}

export default (PlaylistShowcase);