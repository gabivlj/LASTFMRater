import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { LinearProgress, IconButton, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import RatingsCommon from '../Common/RatingsCommon';
import {
  rateTrack,
  getTrack,
  cleanTrackPage,
} from '../../actions/trackActions';
import CommentComponent from '../CommentSection/Common/CommentComponent';
import ReviewsSection from '../Common/ReviewsSection';
import { postReview, cleanReviews } from '../../actions/reviewActions';

function TrackPage({
  track,
  auth,
  getTrack,
  rateTrack,
  match,
  history,
  postReview,
  cleanTrackPage,
  cleanReviews,
}) {
  useEffect(() => {
    const { artist, album, name, trackID } = match.params;
    getTrack(name, artist, album, trackID, auth ? auth.user : '');
    return () => {
      cleanReviews();
      cleanTrackPage();
    };
  }, []);
  return (
    <div>
      {track.loading && <LinearProgress />}
      {!track.loading && track.track._id && (
        <div className="container">
          <h1>{`${track.track.name} by ${track.track.artist}`}</h1>
          <RatingsCommon
            auth={auth}
            elementWithRatings={track.track}
            elementId={track.track._id}
            model={track.track}
            setRatings={(_id, rating) => {
              rateTrack(rating, track.track._id);
            }}
          />
          <div>
            <ReviewsSection
              objectID={track.track._id}
              type="TRACK"
              uuid="TRACK_SECT"
            />
          </div>

          {auth && auth.id ? (
            <Button
              color="primary"
              variant="contained"
              component="span"
              onClick={() => postReview(history, track.track._id, 'tracks')}
            >
              Make a review
            </Button>
          ) : null}

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
    { rateTrack, getTrack, postReview, cleanReviews, cleanTrackPage },
  )(TrackPage),
);
