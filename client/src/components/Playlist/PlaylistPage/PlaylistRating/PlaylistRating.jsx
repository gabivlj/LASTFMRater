import React from 'react';
import PropType from 'prop-types';
import RatingsCommon from '../../../Common/RatingsCommon';
import { addPlaylistRating} from '../../../../actions/playlistActions';
import { connect } from 'react-redux';

function PlaylistRating({ playlist, auth, addPlaylistRating}) {

  return (
    <div className="mt-3">
      <RatingsCommon
        ratings={playlist.ratings}
        auth={auth}
        elementWithRatings={playlist}
        setRatings={addPlaylistRating}
        elementId={playlist._id}
        username={auth.user}
      />
    </div>
  )
}

PlaylistRating.propTypes = {
  playlist: PropType.object.isRequired,
  auth: PropType.object.isRequired,
  addPlaylistRating: PropType.func.isRequired,
}

export default connect(null, { addPlaylistRating })(PlaylistRating);