export default (
  state = { auth: false, currentUser: null, artists: {}, apiUser: null },
  action
) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        auth: true,
        currentUser: action.payload
      }
    case 'SET_API_USER':
      return {
        ...state,
        auth: true,
        apiUser: action.payload
      }
    case 'SET_USER_ARTISTS':
      return {
        ...state,
        artists: action.payload
      }
    default:
      return state
  }
}
