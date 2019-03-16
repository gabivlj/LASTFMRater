const initialState = {
  album: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALBUM':
      return {
        ...state,
        album: action.payload
      }
    default:
      return state
  }
}
