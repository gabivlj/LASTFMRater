import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { LinearProgress, IconButton } from '@material-ui/core';
import PlaylistsShowcase from './PlaylistsShowcase';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function Playlists({ playlists, ...props }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mt-2">
      <h1 className="mt-3">Playlists</h1>
      <div className="mt-2">
        {
          playlists.loading ? ( 
          <LinearProgress /> 
          ) : (
            <PlaylistsShowcase 
              playlists={expanded ? playlists.list : playlists.list.slice(0, 6) } 
            />
          )
        }
        <IconButton
          className={`${expanded ? 'expanded' : 'notexpanded'} mt-2`}
          aria-label="Show more"
          onClick={() => setExpanded(!expanded)}
        >
          <ExpandMoreIcon />
        </IconButton>
      </div>
    </div>
  )
}

Playlists.propTypes = {
  playlists: PropTypes.object.isRequired,
}

export default Playlists;