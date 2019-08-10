import Axios from 'axios';
import SocketInstance from '../classes/SocketInstance';
import { notifySuccess, notifyNormality, notifyError } from './notifyActions';
import handleError from '../utils/handleError';

/**
 * @param {object} , message, to, username
 * @description Call this function when you wanna send a message.
 */
export const sendMessage = ({
  message,
  to,
  username,
  fromId,
  toUsername
}) => async dispatch => {
  if (!SocketInstance.socket) return null;
  const { socket } = SocketInstance;
  socket.sendMessage(message, to, username);
  // TODO: Handle redux and node.js db.
  const [res, err] = await handleError(
    Axios.post('/api/chat/new', {
      from: { _id: fromId, username },
      to: { _id: to, username: toUsername },
      text: message
    })
  );
  if (err) {
    return dispatch(notifyError('Error sending message...', 500));
  }
  dispatch({
    type: 'SEND_MESSAGE',
    payload: res.data.chat.messages[res.data.chat.messages.length - 1]
  });
  return dispatch(notifySuccess('Message sent succesfuly...', 1000));
};

export const getChat = otherId => async dispatch => {
  const [res, err] = await handleError(Axios.get(`/api/chat/${otherId}`));
  if (err) {
    return dispatch(notifyError('Error getting chat...', 500));
  }
  const { data } = res;
  return dispatch({
    type: 'GET_CHAT',
    payload: data.chat
  });
};

export const setChatUsername = username => dispatch => {
  return dispatch({
    type: 'SET_CHAT',
    payload: username
  });
};

/**
 * @param {EventHandler} e
 * @description Pass this function to new Socket() so it executes it.
 */
export const receiveMessage = e => dispatch => {
  const json = JSON.parse(e.data);
  const { message, from, type, username, to, userId } = json;
  console.log(json);
  switch (type) {
    // TODO: Handle redux.
    case 'Message':
      dispatch(notifyNormality(`${message} from ${from}`), 10000);
      return dispatch({
        type: 'RECEIVE_MESSAGE',
        payload: {
          chat: {
            username: from,
            text: message
          },
          from: userId
        }
      });
    case 'ListOfFriends':
      // dispatch(notifyNormality("Go"))
      break;
    case 'NewFriendConnected':
      return dispatch(notifyNormality(`${username} connected!`));
    default:
      return null;
  }
};
