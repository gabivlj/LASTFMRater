import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { LinearProgress, IconButton, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import RatingsCommon from '../Common/RatingsCommon';
import { rateTrack, getTrack } from '../../actions/trackActions';
import CommentComponent from '../CommentSection/Common/CommentComponent';
import ReviewsSection from '../Common/ReviewsSection';

function TrackPage({ track, auth, getTrack, rateTrack, match }) {
  useEffect(() => {
    const { artist, album, name, trackID } = match.params;
    getTrack(name, artist, album, trackID, auth ? auth.user : '');
    return () => {};
  }, []);
  return (
    <div>
      {track.loading && <LinearProgress />}
      {!track.loading && track.track._id && (
        <div className="container">
          <h1>{`${track.track.name} by ${track.track.artist}`}</h1>
          <RatingsCommon
            auth={auth}
            model={track.track}
            setRatings={(_id, rating) => {
              rateTrack(rating, track.track._id);
            }}
          />
          <div>
            <ReviewsSection objectID={track.track._id} type="TRACK" />
          </div>
          <CommentComponent
            keyy="999"
            objectId={track.track._id}
            numberOfCommentsAdd={20}
            name={`${track.track.name} by ${track.track.artist}`}
          />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  track: state.track,
  auth: state.auth.apiUser,
});

export default withRouter(
  connect(
    mapStateToProps,
    { rateTrack, getTrack },
  )(TrackPage),
);
