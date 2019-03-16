const initialState = {
  artist: {},
  albums: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ARTIST_ALBUMS':
      return {
        ...state,
        albums: action.payload.topalbums
      }
    case 'SET_ARTIST':
      return {
        ...state,
        artist: action.payload
      }
    default:
      return state
  }
}
