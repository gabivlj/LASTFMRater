import SocketInstance from '../classes/SocketInstance';
import { notifySuccess, notifyNormality } from './notifyActions';

/**
 * @param {object} , message, to, username
 * @description Call this function when you wanna send a message.
 */
export const sendMessage = ({ message, to, username }) => dispatch => {
  if (!SocketInstance.socket) return null;
  const { socket } = SocketInstance;
  socket.sendMessage(message, to, username);
  // TODO: Handle redux and node.js db.
  return dispatch(notifySuccess('Message sent succesfuly...', 1000));
};

/**
 * @param {EventHandler} e
 * @description Pass this function to new Socket() so it executes it.
 */
export const receiveMessage = e => dispatch => {
  const json = JSON.parse(e.data);
  const { message, from, type, username } = json;
  console.log(json);
  switch (type) {
    // TODO: Handle redux.
    case 'Message':
      dispatch(notifyNormality(`${message} from ${from}`), 10000);
      break;
    case 'ListOfFriends':
      // dispatch(notifyNormality("Go"))
      break;
    case 'NewFriendConnected':
      return dispatch(notifyNormality(`${username} connected!`));
    default:
  }
};
