import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import RatingsCommon from '../../../Common/RatingsCommon';
import { addPlaylistRating } from '../../../../actions/playlistActions';

function PlaylistRating({ playlist, auth, addPlaylistRating }) {
  return (
    <div className="mt-3">
      <RatingsCommon
        model={playlist}
        ratings={playlist.ratings}
        auth={auth}
        elementWithRatings={playlist}
        setRatings={addPlaylistRating}
        elementId={playlist._id}
        username={auth.apiUser.user}
        comparisonInRatingUpdate={auth.apiUser.id}
      />
    </div>
  );
}

PlaylistRating.propTypes = {
  playlist: PropType.object.isRequired,
  auth: PropType.object.isRequired,
  addPlaylistRating: PropType.func.isRequired,
};

export default connect(
  null,
  { addPlaylistRating },
)(PlaylistRating);
