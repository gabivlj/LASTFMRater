import { combineReducers } from 'redux'
import authReducer from './authReducer'
import artistReducer from './artistReducer'
import albumReducer from './albumReducer'

export default combineReducers({
  auth: authReducer,
  artist: artistReducer,
  album: albumReducer
})
