/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import PlaylistShowcase from '../Playlist/PlaylistShowcase';
import Ratings from '../Ratings/Ratings';
import {
  getProfile,
  cleanErrors,
  uploadImage,
  followUser,
  cleanProfile,
} from '../../../actions/profileActions';
import ProfileInfo from './ProfileInfo';
import ProfileArtists from './ProfileArtist/ProfileArtists';
import ProfileImg from '../../../images/profile.png';
import {
  setChatUsername,
  open,
  setChatInfo,
  setChatRoute,
  ROUTES,
} from '../../../actions/chatActions';
import Hider from '../../Common/Hider/Hider';
import ReviewsSection from '../../Common/ReviewsSection';
import TimelineScroll from '../../Timeline/TimelineScroll/TimelineScroll';

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
  followUser,
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

  function returnElements() {
    const mostListened = {
      Component:
        profile.profile.lastfm && profile.profile.lastfm.length !== '' ? (
          <div>
            <ProfileArtists artists={profile.profile.artists.artists.artist} />
          </div>
        ) : (
          <h3>This user has no most listened artists!</h3>
        ),
      jsx: false,
      name: 'Most listened artists',
    };

    const timeline = {
      Component: <TimelineScroll id={profile.profile._id} />,
      jsx: false,
      name: 'Gramps',
    };

    const reviewSections = {
      Component: (
        <ReviewsSection
          type="ALBUM"
          objectID={profile.profile._id}
          profileImage={{
            image: profileImage.image,
            goImage: !!profile.profile.images[currentImg],
          }}
          profile
          key="1"
        />
      ),
      jsx: false,
      name: 'Reviews',
    };
    const reviewInProgress = {
      Component: (
        <ReviewsSection
          type="ALBUM"
          objectID={profile.profile._id}
          profile
          profileImage={{
            image: profileImage.image,
            goImage: !!profile.profile.images[currentImg],
          }}
          uuid="SCROLLER_HIDDEN"
          key="2"
          show={false}
        />
      ),
      jsx: false,
      name: 'Reviews in progress',
    };

    const trackReviews = {
      Component: (
        <ReviewsSection
          type="TRACK"
          objectID={profile.profile._id}
          profile
          profileImage={{
            image: profileImage.image,
            goImage: !!profile.profile.images[currentImg],
          }}
          uuid="SCROLLER_HIDDEN_TRACK"
          key="3"
        />
      ),
      jsx: false,
      name: 'Track reviews',
    };

    const trackReviewsHidden = {
      Component: (
        <ReviewsSection
          type="TRACK"
          objectID={profile.profile._id}
          profile
          profileImage={{
            image: profileImage.image,
            goImage: !!profile.profile.images[currentImg],
          }}
          uuid="SCROLLER_HIDDEN_TRACK_PRIVATE"
          key="4"
          show={false}
        />
      ),
      jsx: false,
      name: 'Started track reviews',
    };

    const elementsArray = sameProfile
      ? [
          timeline,
          mostListened,
          reviewSections,
          reviewInProgress,
          trackReviews,
          trackReviewsHidden,
        ]
      : [timeline, mostListened, reviewSections, trackReviews];

    return elementsArray;
  }

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
            follows={profile.profile.follows}
            followed={profile.profile.followed}
            mutuals={profile.profile.mutuals}
            isUser={profile.profile.itsUser}
            follow={() => {
              followUser(profile.profile._id);
            }}
            chatButton={
              <button
                type="button"
                // to={`/chat/${profile.profile._id}`}
                className="btn btn-primary"
                onClick={() => {
                  setChatUsername(profile.profile.user);
                  setChatInfo({
                    username: profile.profile.user,
                    id: profile.profile._id,
                    profileImage,
                  });
                  open();
                  setChatRoute(ROUTES.CHAT);
                }}
              >
                <i className="fa fa-paper-plane" aria-hidden="true" />
              </button>
            }
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
          {/* {profile.profile.lastfm && profile.profile.lastfm.length !== '' ? (
            <div>
              <ProfileArtists
                artists={profile.profile.artists.artists.artist}
              />
            </div>
          ) : (
            <h3>This user has no most listened artists!</h3>
          )} */}
          <div>
            <Hider
              style={{ marginLeft: '6.5%', marginTop: '100px' }}
              components={returnElements()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
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
    open,
    followUser,
  },
)(Profile);
