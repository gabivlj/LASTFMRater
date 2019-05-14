import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import axios from 'axios'
import Rating from './Rating';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';

const propTypes = {
  // A rating has: { name, artist, rating: { puntuation, id }, mbid}
  ratings: PropTypes.array,
  username: PropTypes.string,
  ratingsProps: PropTypes.array,
};

const defaultProps = {
  ratingsProps: null,
  ratings: [],
  username: '',
}

function Ratings({ ratings, username, ratingsProps, usernameProps }) {
  const [albums, setAlbums] = useState([]);
  const _ratings = ratingsProps || ratings;
  const _username = usernameProps || username;

  useEffect(() => {
    (async () => {
      let promiseRating = [];
      if (_ratings) {
        for (let rating of _ratings) {
          promiseRating.push(axios.get(`/api/album/${rating}`));
        }
        let albumsSet = (await Promise.all(promiseRating)).map(promise => promise.data);
        albumsSet.forEach(album => album.rating = album.ratings.filter(r => String(r.user) === String(_username))[0]);
        setAlbums(albumsSet);        
      }
    })()
  }, [ratings, ratingsProps]);
  const renderError = !albums ? (
    <div className="m-3">
      <CircularProgress />
    </div> ) : (
      <h3>This user hasn't got any ratings yet!</h3>
    );
  return (
    <div>
      {albums && albums.length > 0 ? albums.map(rating => 
      (rating.rating ? <Rating
        albumName={rating.name} 
        artistName={rating.artist} key={rating._id} 
        rating={rating.rating.puntuation}
        mbid={rating.mbid ? rating.mbid : 0}
        generalScore={10}
      /> : null)) : <div className="m-3">{renderError}</div> }
    </div>
  )
}

Ratings.propTypes = propTypes;
Ratings.defaultProps = defaultProps;

const mapStateToProps = (state) => ({
  ratings: state.auth.apiUser ? state.auth.apiUser.ratedAlbums : null,
  username: state.auth.apiUser ? state.auth.apiUser.user : null
});

export default connect(mapStateToProps, {})(Ratings)