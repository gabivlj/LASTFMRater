import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const __propTypes = {
  album: PropTypes.array.isRequired,
  image: PropTypes.image,
  artist: PropTypes.string
}

const ArtistAlbums = ({ album, image, artist, ...props }) => {
  return (
    <div className="row">
      {album
        ? album.map(element =>
            element.name !== '(null)' ? (
              <div className="card col-md-4">
                {/* Sometimes the image doesn't work because Lastfm api... We must find another way*/}
                <img
                  className="card-img-top"
                  src={
                    element.image[3]['#text'] !== ''
                      ? element.image[3]['#text']
                      : image
                  }
                  alt="Album"
                />
                <div className="card-body">
                  <h5 className="card-title">{element.name}</h5>
                  <p className="card-text">
                    Made by: {element.artist.name} <br />
                    Playcounts:{' '}
                    <div className="badge badge-primary">
                      {element.playcount}
                    </div>
                  </p>
                  <Link
                    to={`/album/${element.artist.name}/${element.name}/${
                      element.mbid ? element.mbid : 0
                    }`}
                    className="btn btn-primary"
                  >
                    Go to album's profile
                  </Link>
                </div>
              </div>
            ) : null
          )
        : null}
    </div>
  )
}

ArtistAlbums.propTypes = __propTypes

export default ArtistAlbums
