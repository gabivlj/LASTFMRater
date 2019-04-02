import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { LinearProgress } from '@material-ui/core'
import Artists from './visual/Artists'
import { IconButton } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import './artists.styles.css'

const propTypes__ = {
  artists: PropTypes.object.isRequired
}

function ArtistsComponent({ artists }) {
  const [expanded, setExpanded] = useState(false)
  const ArtistsLogic = () => {
    return artists.loading ? (
      <LinearProgress />
    ) : (
      <Artists artists={expanded ? artists.list : artists.list.slice(0, 6)} />
    )
  }
  return (
    <div className="mt-2">
      <h1 className="mt-3">Artists</h1>
      <div className="mt-2">{ArtistsLogic()}</div>
      <IconButton
        className={(expanded ? 'expanded' : 'notexpanded') + ' mt-2'}
        aria-label="Show more"
        onClick={() => setExpanded(!expanded)}
      >
        <ExpandMoreIcon />
      </IconButton>
    </div>
  )
}

ArtistsComponent.propTypes = propTypes__
export default ArtistsComponent
