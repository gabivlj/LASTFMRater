import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import PlaylistShowcase from '../Playlist/PlaylistShowcase';
import Ratings from '../Ratings/Ratings';
import { getProfile, cleanErrors } from '../../../actions/profileActions';
import ProfileInfo from './ProfileInfo';
import ProfileArtists from './ProfileArtist/ProfileArtists';

/**
 * @todo I think we will be changing Auth.jsx to this, Or separate or i don't know, but we must do profile page again.
 */
function Profile({ cleanErrors, profile, getProfile, auth, match, ...props }) {
  // WillMount
  useEffect(() => {
    const { id } = props.match.params;
    getProfile(id);
  }, []);
  // Unmount
  useEffect(() => {
    return () => cleanErrors();
  }, []);
  // Check if user is the same as the profile.
  const loged = auth.auth;
  const sameProfile =
    loged &&
    auth.apiUser.user &&
    profile.profile &&
    auth.apiUser.user === profile.profile.user;
  const { error } = profile;
  // If there is an error finding profile redirect to not found or sth
  if (error !== null) {
    props.history.push('/not/found');
  }
  return (
    <div style={{ marginTop: '100px', paddingBottom: '200px' }}>
      {profile.isLoading || !profile.profile ? (
        <LinearProgress />
      ) : (
        <div>
          <ProfileInfo
            img={profile.profile.img}
            name={profile.profile.user}
            lastfm={profile.profile.lastfm}
            followers={profile.profile.followers}
          />
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <PlaylistShowcase
                  playlists={profile.profile.playlists}
                  authentified={sameProfile}
                />
              </div>
              <div className="col-md-8">
                <div>
                  <div style={{ marginTop: '' }}>
                    <h2>
                      Ratings made by
                      {profile.profile.user}
                    </h2>
                    <Ratings
                      usernameProps={profile.profile.user}
                      ratingsProps={profile.profile.ratedAlbums}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {profile.profile.lastfm && profile.profile.lastfm.length !== '' ? (
            <div>
              <ProfileArtists
                artists={profile.profile.artists.artists.artist}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getProfile,
    cleanErrors
  }
)(Profile);
