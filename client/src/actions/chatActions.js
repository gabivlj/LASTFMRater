import uuid from 'uuid/v1';
import SocketInstance from '../classes/SocketInstance';
import { notifySuccess, notifyNormality, notifyError } from './notifyActions';
import handleError from '../utils/handleError';
import { axiosAPI } from '../utils/axios';

let finishedTimeOut = true;

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

export const cleanChatNotifications = id =>
  axiosAPI.post(`/chat/cleanNotifications/${id}`);

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
  if (!finishedTimeOut) return false;
  if (!message.length) return false;
  dispatch({
    type: 'TEMPORARY_MESSAGE',
    payload: {
      text: message,
      to,
      username,
      toUsername,
      provisionalId: uuid(),
    },
  });
  finishedTimeOut = false;
  const [res, err] = await handleError(
    axiosAPI.post('/chat/new', {
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
    // Reset messages because socket is gonna send us the message anyways.
    res.data.chat.messages = [];
    dispatch({
      type: 'GET_CHAT',
      payload: res.data.chat,
    });
  }

  setTimeout(() => {
    finishedTimeOut = true;
  }, 400);

  // return dispatch(notifySuccess('Message sent succesfuly...', 1000));
};

/**
 * @description API call to get the notification sum
 * @returns {Number}, numberOfNotifications
 */
export const getNotificationsSum = () => {
  return new Promise(async (resolve, reject) => {
    const [res, err] = await handleError(axiosAPI.get(`/chat/notificationSum`));
    if (err) {
      return reject(err);
    }
    const { notificationSum } = res.data;
    if (!notificationSum)
      return reject(
        new Error('Bad request, didnt return notificationSum param.'),
      );
    return resolve(notificationSum);
  });
};

export const getChat = (otherId, get = '') => async dispatch => {
  dispatch(setLoading());
  const [res, err] = await handleError(axiosAPI.get(`/chat/${get}${otherId}`));
  if (err) {
    return dispatch(notifyError('Error getting chat...', 500));
  }
  const { data } = res;
  console.log(get, otherId);
  if (
    data.chat &&
    data.chat.lastPerson &&
    data.chat.lastPerson.notification &&
    otherId === data.chat.lastPerson.user
  ) {
    cleanChatNotifications(data.chat._id);
    dispatch({
      type: 'SUBSTRACT_TOTAL_NOTIFICATIONS',
      payload: data.chat.lastPerson.notification,
    });
  }
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
  console.log(json);
  const { message, from, type, username, to, userId, friends } = json;
  const s = state();
  const { auth, chat } = s;
  const { id } = auth.apiUser;
  console.log(id, userId);
  switch (type) {
    case 'Followed':
      return dispatch(notifyNormality(`${message}`));
    case 'Unfollowed':
      return dispatch(notifyNormality(`${message}`));
    case 'Message':
      if (userId !== id) {
        dispatch(notifyNormality(`${message} from ${from}`), 10000);
        if (
          !chat ||
          !chat.chat ||
          chat.route !== ROUTES.CHAT ||
          !chat.open ||
          !chat.currentChatInfo ||
          chat.currentChatInfo.username !== from
        ) {
          dispatch({
            type: 'ADD_TOTAL_NOTIFICATIONS',
            payload: 1,
          });
        }
      } else {
        dispatch({
          type: 'CLEAN_TEMPORARY_MESSAGE',
          payload: { text: message, username: from },
        });
      }
      if (
        chat.route === ROUTES.CHAT &&
        chat.open &&
        chat.chat &&
        chat.currentChatInfo.username === from
      ) {
        cleanChatNotifications(chat.chat._id);
      }
      dispatch({
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
      return dispatch({
        type: 'UPDATE_CHAT_LIST',
        payload: {
          user: userId,
          message: { text: message, username: from, user: userId },
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
      return dispatch({ type: 'NEW_GRAMPS', payload: true });

    default:
      return null;
  }
};

export const getChats = () => async dispatch => {
  dispatch(setLoading());
  const [res, err] = await handleError(axiosAPI.get('/chat'));
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
  const [res, err] = await handleError(axiosAPI.get('/profile/get/friends'));
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
