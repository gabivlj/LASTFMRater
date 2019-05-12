import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import guidGenerator from '../../../../utils/idCreator';

function ProfileArtists({ artists }) {
  let render;
  if (artists && artists.length > 0) {
    render = artists.map(artist => 
      <Link className="card-profile 1" key={guidGenerator()} to={`/artist/${artist.name}`}>
        <div className="card-image-profile"><img src={artist.image[4]['#text']} /></div>
        <div className="card-title-profile title-white">
          <p>{artist.name}</p>
        </div>
      </Link>
    );
  }
  return (
    <div>
      <h1>
      Most listened artists!
      </h1>
      <div className="cards-list-profile"> 
        {render}
      </div>
    </div>
  )
}

ProfileArtists.propTypes = {
  artists: PropTypes.array.isRequired,
}

export default ProfileArtists;