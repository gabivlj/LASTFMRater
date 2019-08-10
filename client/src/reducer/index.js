import { combineReducers } from 'redux';
import authReducer from './authReducer';
import artistReducer from './artistReducer';
import albumReducer from './albumReducer';
import searchReducer from './searchReducer';
import playlistReducer from './playlistReducer';
import profileReducer from './profileReducer';
import commentReducer from './commentReducer';
import notifyReducer from './notifyReducer';
import chatReducer from './chatReducer';

export default combineReducers({
  auth: authReducer,
  artist: artistReducer,
  album: albumReducer,
  search: searchReducer,
  playlist: playlistReducer,
  profile: profileReducer,
  comments: commentReducer,
  notify: notifyReducer,
  chat: chatReducer
});
