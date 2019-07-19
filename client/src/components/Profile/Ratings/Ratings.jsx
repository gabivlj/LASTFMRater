import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import Rating from './Rating';
import handleError from '../../../utils/handleError';

const propTypes = {
  // A rating has: { name, artist, rating: { puntuation, id }, mbid}
  ratings: PropTypes.array,
  username: PropTypes.string,
  ratingsProps: PropTypes.array,
  usernameProps: PropTypes.string
};

const defaultProps = {
  ratingsProps: null,
  ratings: [],
  username: ''
};

function Ratings({ ratings, username, ratingsProps, usernameProps }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const trueRatings = ratingsProps || ratings;
  const trueUsername = usernameProps || username;
  useEffect(() => {
    (async () => {
      if (trueRatings) {
        setLoading(true);
        const [res, error] = await handleError(
          axios.get(`/api/profile/ratings/${trueUsername}`)
        );
        if (error) {
          setLoading(true);
          // todo check error
          return;
        }
        const { data } = res;
        const { puntuations } = data;
        setAlbums(puntuations);
        setLoading(false);
      }
    })();
  }, [ratings, ratingsProps]);
  const renderError =
    albums.length === 0 && loading ? (
      <div className="m-3">
        <CircularProgress />
      </div>
    ) : (
      <h3>This user hasn't got any ratings yet!</h3>
    );
  return (
    <div>
      {albums && albums.length > 0 ? (
        albums.map(rating =>
          rating && rating.rating ? (
            <Rating
              albumName={rating.name}
              artistName={rating.artist}
              key={rating._id}
              rating={rating.rating.puntuation}
              mbid={rating.mbid ? rating.mbid : 0}
              generalScore={10}
            />
          ) : null
        )
      ) : (
        <div className="m-3">{renderError}</div>
      )}
    </div>
  );
}

Ratings.propTypes = propTypes;
Ratings.defaultProps = defaultProps;

const mapStateToProps = state => ({
  ratings: state.auth.apiUser ? state.auth.apiUser.ratedAlbums : null,
  username: state.auth.apiUser ? state.auth.apiUser.user : null
});

export default connect(
  mapStateToProps,
  {}
)(Ratings);
