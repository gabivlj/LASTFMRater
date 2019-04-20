import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Album from './Album';

import './album.style.css';

const __propTypes = {
  albums: PropTypes.object.isRequired,
};

const Albums = ({ albums, ...props }) => {
  const [expanded, setExpanded] = useState(false);
  const albums__ = albums.list.map((element, index) => (
    <Album className="col-md-4 m-3" album={element} key={index} />
  ));
  return (
    <div className="mt-3">
      <h1 className="mt-2">Albums</h1>
      {albums.loading ? (
        <LinearProgress
          color="secondary"
          style={{ marginLeft: '', marginBottom: '0%' }}
        />
      ) : (
        <div className="row">{expanded ? albums__ : albums__.slice(0, 6)}</div>
      )}
      <IconButton
        className={`${expanded ? 'expanded' : 'notexpanded'} mt-2`}
        aria-label="Show more"
        onClick={() => setExpanded(!expanded)}
      >
        <ExpandMoreIcon />
      </IconButton>
    </div>
  );
};

Albums.propTypes = __propTypes;

export default Albums;
