import { combineReducers } from 'redux'
import authReducer from './authReducer'
import artistReducer from './artistReducer'
import albumReducer from './albumReducer'
import searchReducer from './searchReducer'

export default combineReducers({
  auth: authReducer,
  artist: artistReducer,
  album: albumReducer,
  search: searchReducer
})
