import React, { Component, useEffect } from 'react'
import { connect } from 'react-redux';
import PlaylistShowcase from '../Playlist/PlaylistShowcase';
import { LinearProgress } from '@material-ui/core';
import Ratings from '../Ratings/Ratings';
import { getProfile } from '../../../actions/profileActions';
import ProfileInfo from './ProfileInfo';
import ProfileArtists from './ProfileArtist/ProfileArtists';

/**
 * @todo I think we will be changing Auth.jsx to this, Or separate or i don't know, but we must do profile page again.
 */
function Profile({ profile, getProfile, ...props }) {
  useEffect(() => {
    const { id } = props.match.params;
    getProfile(id);
  }, []);
  
  return (
    <div style={{marginTop: '100px', paddingBottom: '200px'}}>
      { profile.isLoading || !profile.profile ? <LinearProgress/> : ( 
        <div>
          <ProfileInfo
            img={profile.profile.img}
            name={profile.profile.user}
            lastfm={profile.profile.lastfm}
            followers={profile.profile.followers}
          />
          <PlaylistShowcase 
            playlists={profile.profile.playlists}
            authentified={false}
          />
          <div className="container">
            <div style={{marginTop: '50px'}}>
              <h2>Ratings made by {profile.profile.user}</h2>
              <Ratings 
                usernameProps={profile.profile.user}
                ratingsProps={profile.profile.ratedAlbums}
              />
            </div>
          </div>
          <div className="container">
            <ProfileArtists artists={profile.profile.artists.artists.artist}/>
          </div>
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