/* eslint-disable prettier/prettier */
import React from 'react';
import './gramp.styles.css';
import { Avatar, Icon } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import { Link } from 'react-router-dom';
import linksHttp from '../../utils/links.http';
import profile from '../../images/profile.png';
import activityTypes from '../../utils/activityTypes';
import Stars from '../Profile/Ratings/Stars';
import { getIconRender, getBodyTimeline } from '../../utils/timelineIcons';
import IconTimeline from './IconTimeline';
import BodyGramp from './BodyGramp';

const PHRASES = {
  en: {
    [activityTypes.ALBUM_RATING]: 'has rated',
    [activityTypes.COMMENT]: {
      not_response: 'has commented on',
      response: 'responded a gramp from',
    },
    [activityTypes.CREATED_PLAYLIST]: 'created a playlist',
    [activityTypes.FOLLOWED_USER]: 'followed',
    [activityTypes.PLAYLIST_RATING]: 'has rated',
  },
};

function Gramp({ gramp, onClick }) {
  const { username, user, type, date, information = {}, _id, images } =
    gramp || {};
  const { pathname, name, text, score, creator, followed, follows, answered } =
    information || {};
  let srcImg = profile;
  if (images && images.length > 0) {
    srcImg = `${linksHttp.GO_IMAGE}/api/image/${images[0].lg.split('.')[0]}`;
  }
  return (
    <div
      className="gramp"
      role="button"
      tabIndex={0}
      onClick={e => {
        if (type === activityTypes.COMMENT)
          onClick({
            _id: information.commentId || information.objId,
            text,
            image: srcImg,
            username,
          });
      }}
      onKeyDown={e => {
        if (type === activityTypes.COMMENT)
          onClick({
            _id: information.commentId || information.objId,
            text,
            image: srcImg,
            username,
          });
      }}
    >
      <div className="gramp-upper row">
        <div className="col-4">
          <div className="row">
            <div className="col-6">
              <Icon>
                <IconTimeline type={type} />
              </Icon>
            </div>
            <div className="col-6">
              <Avatar
                className="gramp-avatar mt-2"
                alt={username}
                src={srcImg}
              />
            </div>
          </div>
        </div>
        <div className="col-8">
          {type !== activityTypes.FOLLOWED_USER ? (
            <h2>
              {username}
              {` ${
                typeof PHRASES.en[type] === 'string'
                  ? PHRASES.en[type]
                  : (() =>
                      answered
                        ? PHRASES.en[type].response
                        : PHRASES.en[type].not_response)()
              } `}
              <Link to={pathname}>{name}</Link>
            </h2>
          ) : (
            <h2 className="mt-3">
              <Link to={`/profile/${follows.username}`}>
                {`${follows.username}`}
              </Link>
              {' '}
              followed
              {' '}
              <Link to={`/profile/${followed.username}`}>
                {`${followed.username}`}
              </Link>
            </h2>
          )}
        </div>
      </div>
      <div>
        <BodyGramp text={text} score={score} type={type} />
      </div>
    </div>
  );
}

export default Gramp;
