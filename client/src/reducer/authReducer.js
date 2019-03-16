export default (
  state = { auth: false, currentUser: null, artists: {} },
  action
) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        auth: true,
        currentUser: action.payload
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
