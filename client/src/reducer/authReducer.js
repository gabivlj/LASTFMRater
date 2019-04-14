export default (
  state = {
    auth: null,
    currentUser: null,
    artists: {},
    lastFmUser: '',
    apiUser: null,
    isLoading: false
  },
  action
) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        auth:
          action.payload && Object.keys(action.payload).length > 0
            ? true
            : false,
        currentUser: action.payload
      }
    case 'SET_API_USER':
      return {
        ...state,
        auth: action.payload && Object.keys(action.payload).length > 0,
        apiUser: action.payload,
        isLoading: false
      }
    case 'SET_LASTFM_USER':
      return {
        ...state,
        lastFmUser: action.payload
      }
    case 'SET_USER_ARTISTS':
      return {
        ...state,
        artists: action.payload
      }
    case 'SET_IS_LOADING_AUTH':
      return {
        ...state,
        isLoading: !state.isLoading
      }
    default:
      return state
  }
}
