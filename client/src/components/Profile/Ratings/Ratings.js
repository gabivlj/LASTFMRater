import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import axios from 'axios'
import Rating from './Rating';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';

const propTypes = {
  // A rating has: { name, artist, rating: { puntuation, id }, mbid}
  ratings: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
  ratingsProps: PropTypes.array,
};

const defaultProps = {
  ratingsProps: null,
}

function Ratings({ ratings, username, ratingsProps }) {
  const [albums, setAlbums] = useState([]);
  const _ratings = ratingsProps || ratings;

  useEffect(() => {
    (async () => {
      let promiseRating = []
      for (let rating of _ratings) {
        promiseRating.push(axios.get(`/api/album/${rating}`))        
      }
      let albumsSet = (await Promise.all(promiseRating)).map(promise => promise.data)      
      albumsSet.forEach(album => album.rating = album.ratings.filter(r => r.user === username)[0])
      setAlbums(albumsSet)
    })()
  }, [ratings, ratingsProps])
  return (
    <div>
      {albums && albums.length > 0 ? albums.map(rating => 
      (rating.rating ? <Rating
        albumName={rating.name} 
        artistName={rating.artist} key={rating._id} 
        rating={rating.rating.puntuation}
        mbid={rating.mbid ? rating.mbid : 0}
        generalScore={10}
      /> : null)) : <div className="m-3"><CircularProgress /></div> }
    </div>
  )
}

Ratings.propTypes = propTypes;
Ratings.defaultProps = defaultProps;

const mapStateToProps = (state) => ({
  ratings: state.auth.apiUser.ratedAlbums,
  username: state.auth.apiUser.user
});

export default connect(mapStateToProps, {})(Ratings)