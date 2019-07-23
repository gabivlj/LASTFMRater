import React from 'react';
import PropTypes from 'prop-types';
import './Profile.styles.css';

function ProfileInfo({ name, lastfm, followers, img }) {
  return (
    <div className="profileInfoWrapper">
      <div className="container borderProfile">
        <div className="row wrapperProfile">
          <div className="col-md-4">
            <img
              src={img} // "http://localhost:2222/api/image/1"
              className="profileImage borderProfile"
              alt="The profile caption"
            />
          </div>
          <div className="col-md-6">
            <div className="showInfo">
              <h2>{name}</h2>
              <h3>{lastfm === '' ? null : `Known in Lastfm as: ${lastfm}`}</h3>
              <h4>
                Followers:
                {Array.isArray(followers) ? followers.length : 0}
              </h4>
              <p>Standard bio for everything.</p>
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
