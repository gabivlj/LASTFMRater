import React from 'react';
import FriendItem from './FriendItem';

function Friends({ friends, setChatInfo, setChatRoute, friendsConnected }) {
  let friendsRender;
  if (friends) {
    friendsRender = friends.map(friend => (
      <FriendItem
        setChatInfo={setChatInfo}
        key={friend._id}
        friendInfo={friend}
        setChatRoute={setChatRoute}
        connected={friendsConnected[friend._id]}
      />
    ));
  }
  return <div>{friendsRender}</div>;
}

export default Friends;
