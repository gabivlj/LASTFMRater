import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import Rating from './Rating';
import handleError from '../../../utils/handleError';
import ScrollerLoader from '../../Common/ScrollerLoader';
import { axiosAPI } from '../../../utils/axios';

const propTypes = {
  // A rating has: { name, artist, rating: { puntuation, id }, mbid}
  ratings: PropTypes.array,
  username: PropTypes.string,
  ratingsProps: PropTypes.array,
  usernameProps: PropTypes.string,
};

const defaultProps = {
  ratingsProps: null,
  ratings: [],
  username: '',
};

function Ratings({ ratings, username, ratingsProps, usernameProps }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const trueRatings = ratingsProps || ratings;
  const trueUsername = usernameProps || username;
  let areThereStillMoreRatings = true;
  let beginning = 0;
  let ending = 10;
  async function getRatings() {
    if (trueRatings && trueRatings.length > 0 && areThereStillMoreRatings) {
      setLoading(true);
      const [res, error] = await handleError(
        axiosAPI.get(`/profile/ratings/${trueUsername}`, {
          params: { beginning, limit: ending },
        }),
      );
      if (error) {
        console.log(error);
        setLoading(false);
        // todo check error
        return;
      }
      const { data } = res;
      const { puntuations } = data;
      if (puntuations.length === 0) areThereStillMoreRatings = false;
      setAlbums(prev => [...prev, ...puntuations]);
      beginning += 11;
      ending += 9;
      setLoading(false);
    }
    setLoading(false);
  }
  useEffect(() => {
    setAlbums([]);
    beginning = 0;
    ending = 10;
    areThereStillMoreRatings = true;
    getRatings();
    return () => {
      beginning = 0;
      ending = 10;
      areThereStillMoreRatings = true;
      setAlbums([]);
    };
  }, [usernameProps]);
  const renderError =
    loading === true ? (
      <div className="m-3">
        <CircularProgress />
      </div>
    ) : (
      albums.length === 0 && <h3>This user hasn't got any ratings yet!</h3>
    );
  return (
    <ScrollerLoader
      uuid="RATINGS_LOADER"
      actionWhenBottom={getRatings}
      style={{
        minHeight: '200px',
        maxHeight: '400px',
        width: '100%',
        overflowX: 'hidden',
      }}
      preload={false}
    >
      <div>
        {albums && albums.length > 0
          ? albums.map(rating =>
              rating && rating.rating ? (
                <Rating
                  albumName={rating.name}
                  artistName={rating.artist}
                  key={rating._id}
                  rating={rating.rating.puntuation}
                  mbid={rating.mbid ? rating.mbid : 0}
                  generalScore={10}
                />
              ) : null,
            )
          : null}
        <div className="m-3">{renderError}</div>
      </div>
    </ScrollerLoader>
  );
}

Ratings.propTypes = propTypes;
Ratings.defaultProps = defaultProps;

const mapStateToProps = state => ({
  ratings: state.auth.apiUser ? state.auth.apiUser.ratedAlbums : null,
  username: state.auth.apiUser ? state.auth.apiUser.user : null,
});

export default connect(
  mapStateToProps,
  {},
)(Ratings);
