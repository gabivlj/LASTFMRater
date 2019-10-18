/* eslint-disable prettier/prettier */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import './reviewItem.style.css';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import Stars from '../../Profile/Ratings/Stars';
import GoImage from '../GoImage';

function ReviewItem({
  text,
  username,
  puntuation,
  profile,
  album,
  auth,
  id,
  goImg,
  image,
}) {
  return (
    <div className="review-item">
      {profile && album && (
        <Link to={`/album/${album.artist}/${album.name}/${album.mbid}`}>
          {album.name}
          {' by '}
          {album.artist}
        </Link>
      )}
      <div className="row">
        <GoImage
          src={image}
          style={{ width: '2.75vw', height: '2.75vw' }}
          className="profileImage borderProfile"
          alt="The profile caption"
          goImg={goImg}
        />

        <h3 className="mt-3 ml-3">{username}</h3>
      </div>
      <div className="mt-3">
        <ReactMarkdown source={text} skipHtml />
      </div>
      <div>
        <Stars puntuation={puntuation} generalScore={10} />
      </div>
      {auth && username === auth.user && (
        <Link to={`/review/edit/${id}`}>
          <Button color="primary" variant="contained">
            Edit
          </Button>
        </Link>
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth.apiUser,
});

export default connect(mapStateToProps)(ReviewItem);
