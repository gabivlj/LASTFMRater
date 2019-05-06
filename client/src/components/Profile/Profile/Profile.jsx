import React, { Component, useEffect } from 'react'
import { connect } from 'react-redux';
import PlaylistShowcase from '../Playlist/PlaylistShowcase';
import { LinearProgress } from '@material-ui/core';
import Ratings from '../Ratings/Ratings';
import { getProfile } from '../../../actions/profileActions';

/**
 * @todo I think we will be changing Auth.jsx to this, Or separate or i don't know, but we must do profile page again.
 */
function Profile({ profile, getProfile, ...props }) {
  useEffect(() => {
    const { id } = props.match.params;
    getProfile(id);
  }, []);
  
  return (
    <div>
      { profile.isLoading ? <LinearProgress /> : ( 
        <div>
          <PlaylistShowcase 
            playlists={profile.playlists}
          />
          <Ratings 
            username={profile.user}
            ratingsProps={profile.ratedAlbums}
          />
        </div>
        )
      }
    </div>
  )
  
}

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(
  mapStateToProps,
  {
    getProfile
  }
)(Profile);