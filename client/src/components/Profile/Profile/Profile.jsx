import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PlaylistShowcase from '../Playlist/PlaylistShowcase';
import Ratings from '../Ratings/Ratings';
import {
  getProfile,
  cleanErrors,
  uploadImage,
  cleanProfile
} from '../../../actions/profileActions';
import ProfileInfo from './ProfileInfo';
import ProfileArtists from './ProfileArtist/ProfileArtists';
import ProfileImg from '../../../images/profile.png';
import {
  setChatUsername,
  open,
  setChatInfo,
  setChatRoute,
  ROUTES
} from '../../../actions/chatActions';

/**
 * @todo I think we will be changing Auth.jsx to this, Or separate or i don't know, but we must do profile page again.
 */
function Profile({
  cleanErrors,
  cleanProfile,
  profile,
  getProfile,
  auth,
  match,
  uploadImage,
  open,
  setChatInfo,
  setChatUsername,
  setChatRoute,
  ...props
}) {
  const [currentImg, setCurrentImage] = useState(0);
  function nextImage() {
    if (profile.profile.images.length <= currentImg + 1) {
      setCurrentImage(0);
      return;
    }
    setCurrentImage(currentImg + 1);
  }
  function backImage() {
    if (currentImg - 1 < 0) {
      setCurrentImage(profile.profile.images.length - 1);
      return;
    }
    setCurrentImage(currentImg - 1);
  }
  // WillMount
  useEffect(() => {
    const { id } = match.params;
    let userId = '';
    if (auth.apiUser) {
      userId = auth.apiUser.id;
    }
    getProfile(id, userId);
  }, [match]);
  // Unmount
  useEffect(() => {
    return () => {
      cleanErrors();
      cleanProfile();
    };
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
  const profileImage =
    profile.profile && !profile.isLoading && profile.profile.images[currentImg]
      ? { image: profile.profile.images[currentImg].lg, go: true }
      : { image: ProfileImg, go: false };
  return (
    <div style={{ marginTop: '100px', paddingBottom: '200px' }}>
      {profile.isLoading || !profile.profile ? (
        <LinearProgress />
      ) : (
        <div>
          <ProfileInfo
            img={profileImage.image}
            goImg={!!profile.profile.images[currentImg]}
            imgLazy={
              profile.profile.images[currentImg]
                ? profile.profile.images[currentImg].lz
                : ProfileImg
            }
            name={profile.profile.user}
            lastfm={profile.profile.lastfm}
            followers={profile.profile.followers}
            submit={uploadImage}
            next={nextImage}
            back={backImage}
          />
          <button
            type="button"
            // to={`/chat/${profile.profile._id}`}
            onClick={() => {
              setChatUsername(profile.profile.user);
              setChatInfo({
                username: profile.profile.user,
                id: profile.profile._id,
                profileImage
              });
              open();
              setChatRoute(ROUTES.CHAT);
            }}
          >
            Go
          </button>
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
                      {` ${profile.profile.user}`}
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
    cleanErrors,
    uploadImage,
    cleanProfile,
    setChatInfo,
    setChatUsername,
    setChatRoute,
    open
  }
)(Profile);
