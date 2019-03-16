const initialState = {
  album: null,
  albumDB: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALBUM':
      return {
        ...state,
        album: action.payload
      }
    case 'ADD_ALBUM':
      return {
        ...state,
        albumDB: action.payload
      }
    default:
      return state
  }
}
