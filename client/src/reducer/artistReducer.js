const initialState = {
  artist: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ARTIST':
      return {
        ...state,
        artist: action.payload
      }
    default:
      return state
  }
}
