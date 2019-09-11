import Axios from 'axios';
import uuid from 'uuid/v1';
import SocketInstance from '../classes/SocketInstance';
import { notifySuccess, notifyNormality, notifyError } from './notifyActions';
import handleError from '../utils/handleError';
import testTime from '../utils/testTime';
import wait from '../utils/wait';

export const ROUTES = {
  FRIENDS: 'FRIENDS',
  CHATS: 'CHATS',
  CHAT: 'CHAT',
};

export const setLoading = () => {
  return {
    type: 'SET_LOADING_CHAT',
  };
};

/**
 * @param {object} , message, to, username
 * @description Call this function when you wanna send a message.
 */
export const sendMessage = ({
  message,
  to,
  username,
  fromId,
  toUsername,
}) => async dispatch => {
  if (!SocketInstance.socket) return null;
  const [res, err] = await handleError(
    Axios.post('/api/chat/new', {
      from: { _id: fromId, username },
      to: { _id: to, username: toUsername },
      text: message,
    }),
  );
  if (err) {
    return dispatch(
      notifyError(
        'Error sending message, maybe you are not friends anymore...',
        2000,
      ),
    );
  }
  const { socket } = SocketInstance;
  socket.sendMessage(message, to, username);
  // CHECK IF FIRST MESSAGE, IF IT IS FIRST MESSAGE UPDATE WHOLE CHAT, BECAUSE AT FIRST WE DON'T GET THE ENTIRE INFORMATION OF THE CHAT.
  if (res.data.chat.messages.length === 1) {
    dispatch({
      type: 'GET_CHAT',
      payload: res.data.chat,
    });
  }
  // now we don't use this snippet because we do it on the receiveMessage itself.
  // } else {
  //   dispatch({
  //     type: 'SEND_MESSAGE',
  //     payload: res.data.chat.messages[res.data.chat.messages.length - 1]
  //   });
  // }

  return dispatch(notifySuccess('Message sent succesfuly...', 1000));
};

export const getChat = (otherId, get = '') => async dispatch => {
  dispatch(setLoading());
  const [res, err] = await handleError(Axios.get(`/api/chat/${get}${otherId}`));
  if (err) {
    return dispatch(notifyError('Error getting chat...', 500));
  }
  const { data } = res;
  // Check if it exists, if it doesn't probably the user hasn't talked to that guy yet...
  const chat = data.chat || {
    messages: [],
    users: {},
  };
  dispatch(setLoading());
  return dispatch({
    type: 'GET_CHAT',
    payload: chat,
  });
};

export const setChatRoute = route => dispatch => {
  return dispatch({
    type: 'SET_CHAT_ROUTE',
    payload: route,
  });
};

export const setChatUsername = username => dispatch => {
  return dispatch({
    type: 'SET_CHAT',
    payload: username,
  });
};

export const open = (doOpen = false) => dispatch =>
  dispatch({ type: 'OPEN', payload: doOpen });

export const setChatInfo = ({ username, id, profileImage }) => dispatch => {
  return dispatch({
    type: 'SET_CHAT_INFO',
    payload: {
      username,
      id,
      profileImage,
    },
  });
};

/**
 * @param {EventHandler} e
 * @description Pass this function to new Socket() so it executes it.
 */
export const receiveMessage = e => (dispatch, state) => {
  const json = JSON.parse(e.data);
  const { message, from, type, username, to, userId, friends } = json;
  const s = state();
  const { auth } = s;
  const { id } = auth.apiUser;
  switch (type) {
    case 'Message':
      if (userId !== id)
        dispatch(notifyNormality(`${message} from ${from}`), 10000);
      return dispatch({
        type: 'RECEIVE_MESSAGE',
        payload: {
          chat: {
            username: from,
            text: message,
            provisionalId: uuid(),
          },
          from: userId,
        },
      });
    case 'ListOfFriends':
      return dispatch({
        type: 'SET_FRIENDS_CONNECTED',
        payload: friends,
      });
    case 'NewFriendDisconnected':
      return dispatch({
        type: 'SET_FRIEND_CONNECTION',
        payload: {
          user: userId,
          connected: false,
        },
      });
    case 'NewFriendConnected':
      dispatch({
        type: 'SET_FRIEND_CONNECTION',
        payload: {
          user: userId,
          connected: true,
        },
      });
      return dispatch(notifyNormality(`${username} connected!`));
    case 'NewGramp':
      // now we dispatch the new gramps perma noti.
      return dispatch(notifyNormality(`SOCKET TESTING`));
    default:
      return null;
  }
};

export const getChats = () => async dispatch => {
  dispatch(setLoading());
  const [res, err] = await handleError(Axios.get('/api/chat'));
  if (err) {
    console.log(err);
    return dispatch(notifyError('Error retrieving chats...', 3000));
  }
  dispatch(setLoading());
  const { data } = res;
  return dispatch({
    type: 'SET_CHATS',
    payload: data.chats,
  });
};

export const getFriendsProfiles = () => async dispatch => {
  dispatch(setLoading());
  const [res, err] = await handleError(Axios.get('/api/profile/get/friends'));
  if (err) {
    console.log(err);
    return dispatch(notifyError('Error retrieving friends profiles...', 3000));
  }
  dispatch(setLoading());
  const { data } = res;
  return dispatch({
    type: 'SET_FRIENDS',
    payload: data.friends,
  });
};
