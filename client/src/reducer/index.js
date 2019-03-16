import { combineReducers } from 'redux'
import authReducer from './authReducer'
import artistReducer from './artistReducer'
export default combineReducers({
  auth: authReducer,
  artist: artistReducer
})
