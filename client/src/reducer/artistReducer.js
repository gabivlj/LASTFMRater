const initialState = {
  artist: {},
  albums: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ARTIST_ALBUMS':
      return {
        ...state,
        albums: action.payload ? action.payload.topalbums : null
      }
    case 'SET_ARTIST':
      return {
        ...state,
        artist: action.payload ? action.payload : null
      }
    default:
      return state
  }
}
