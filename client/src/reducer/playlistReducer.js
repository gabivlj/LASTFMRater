const initialState = {
  searchedTracks: [],
  addedTracks: [],
  isLoading: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ERROR_PLAYLIST':
      return {
        ...state,
        error: action.payload
      }
    case 'ADD_TRACK_PLAYLIST':
      return {
        ...state,
        addedTracks: [...state.addedTracks, action.payload]
      }
    case 'REMOVE_TRACK_PLAYLIST':
      const indexOf = state.addedTracks
        .map(track => track._id)
        .indexOf(action.payload)
      return {
        ...state,
        addedTracks: [
          ...state.addedTracks.slice(0, indexOf),
          ...state.addedTracks.slice(indexOf + 1, state.addedTracks.length)
        ]
      }
    case 'SEARCH_TRACK_PLAYLIST':
      return {
        ...state,
        searchedTracks: [...action.payload]
      }
    case 'CLEAN_TRACK_SEARCH_PLAYLIST':
      return {
        ...state,
        searchedTracks: []
      }
    case 'SET_IS_LOADING_PLAYLIST_SEARCH':
      return {
        ...state,
        isLoading: !state.isLoading
      }
    default:
      return {
        ...state
      }
  }
}
