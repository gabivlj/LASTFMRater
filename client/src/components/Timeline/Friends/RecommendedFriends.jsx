import React, { useState, useEffect, useRef } from 'react';
import {
  List,
  Card,
  CircularProgress,
  LinearProgress,
} from '@material-ui/core';
import useRecommendedFollowers from '../../../hooks/useRecommendedFriends';
import RecommendedFriend from './RecommendedFriend';

function RecommendedFriends({ scrollTop }) {
  const [recommendedFollowers, loading, setRefresh] = useRecommendedFollowers();
  const ref = useRef(null);

  useEffect(() => {
    if (ref) {
      ref.current.scrollTop = scrollTop;
    }
  }, [ref, scrollTop]);
  let render;
  if (recommendedFollowers.length > 0 && !loading) {
    render = recommendedFollowers.map(follower => (
      <RecommendedFriend friend={follower} key={follower._id} />
    ));
  } else if (recommendedFollowers.length <= 0 && !loading) {
    render = <h3>You do not have any recommended users yet...</h3>;
  } else {
    render = (
      <div>
        <LinearProgress />
      </div>
    );
  }
  return (
    // <div className="parent-recommended">

    <div className="recommended-friends" ref={ref}>
      <Card
        style={{
          maxWidth: '250px',
          marginLeft: '76.6px',
          marginTop: '33.3px',
        }}
      >
        <div className="ml-3">
          <List>{render}</List>
        </div>
      </Card>
    </div>

    // </div>
  );
}

export default RecommendedFriends;
