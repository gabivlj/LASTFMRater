import React from 'react';
import PropTypes from 'prop-types';
import './Profile.styles.css';
import ImageUploader from '../../Common/ImageUploader';
import GoImage from '../../Common/GoImage';

function ProfileInfo({
  name,
  lastfm,
  followers,
  img,
  submit,
  next,
  back,
  follows,
  followed,
  isUser,
  goImg,
  follow,
  chatButton
}) {
  const followButton = !followed ? (
    <button className="btn btn-primary" type="button" onClick={follow}>
      Follow
    </button>
  ) : (
    <button className="btn btn-success" type="button" onClick={follow}>
      <i className="fas fa-check mr-3" />
      Followed
    </button>
  );
  return (
    <div className="profileInfoWrapper">
      <div className="container borderProfile">
        <div className="row wrapperProfile">
          <div className="col-md-4 col-sm-12">
            <GoImage
              goImg={goImg}
              src={img}
              className="profileImage borderProfile"
              alt="The profile caption"
            />
            <div className="profile-buttons">
              <button
                className="btn btn-primary m-2"
                type="button"
                onClick={back}
              >
                {'<'}
              </button>
              <button
                className="btn btn-primary m-2"
                onClick={next}
                type="button"
              >
                {'>'}
              </button>
              {isUser ? <ImageUploader submit={submit} /> : null}
            </div>
          </div>
          <div className="col-md-6">
            <div className="showInfo">
              <h2>{name}</h2>
              <h3>{lastfm === '' ? null : `Known in Lastfm as: ${lastfm}`}</h3>
              <h4>
                Followers:
                {Array.isArray(followers) ? followers.length : 0}
              </h4>
              {follows ? <h6>Follows you.</h6> : null}
              <p>Standard bio for everything.</p>
              {isUser ? null : (
                <div className="row">
                  <div className="col-md-2">{chatButton}</div>
                  <div className="col-md-2">{followButton}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProfileInfo.propTypes = {
  name: PropTypes.string.isRequired,
  followers: PropTypes.array.isRequired,
  lastfm: PropTypes.string,
  img: PropTypes.string
};

ProfileInfo.defaultProps = {
  lastfm: '',
  img:
    'https://www.mompetit.com/wp-content/themes/holalady/img/img_placeholder.png'
};

export default ProfileInfo;
