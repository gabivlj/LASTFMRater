const initialState = {
  albums: [],
  loading: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_ALBUMS':
      return {
        ...state,
        albums: [...action.payload],
        loading: false
      }
    case 'SET_LOADING_SEARCH':
      return {
        ...state,
        albums: [],
        loading: true
      }
    default:
      return state
  }
}
