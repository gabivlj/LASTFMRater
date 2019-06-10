const initialState = {
  searchedTracks: [],
  addedTracks: [],
  isLoading: false,
  playlist: {},
  sending: false,
  currentDragTrack: {},
};

const filterDelete = (tracks, trackid, index = null) => {
  let realIndex = index
  if (index === null || index === undefined) {
    const idTracks = tracks.map(track => track._id);
    realIndex = idTracks.indexOf(trackid);
  }
  return [...tracks.slice(0, realIndex), ...tracks.slice(realIndex + 1, tracks.length)]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SENDING_PLAYLIST':
      return {
        ...state,
        sending: !state.sending
      }
    case 'ERROR_PLAYLIST':
      return {
        ...state,
        error: action.payload,
      };
    case 'SUCCESFUL_API_CALL_PLAYLIST':
      return {
        ...state,
        sending: false
      }
    case 'ADD_TRACK_PLAYLIST':
      return {
        ...state,
        addedTracks: [...state.addedTracks, action.payload],
      };
    case 'REMOVE_TRACK_PLAYLIST':
      const indexOf = state.addedTracks
        .map(track => track._id)
        .indexOf(action.payload);
      return {
        ...state,
        addedTracks: [
          ...state.addedTracks.slice(0, indexOf),
          ...state.addedTracks.slice(indexOf + 1, state.addedTracks.length),
        ],
      };
    case 'SEARCH_TRACK_PLAYLIST':
      return {
        ...state,
        searchedTracks: [...action.payload],
      };
    case 'CLEAN_TRACK_SEARCH_PLAYLIST':
      return {
        ...state,
        searchedTracks: [],
      };
    case 'SET_IS_LOADING_PLAYLIST_SEARCH':
      return {
        ...state,
        isLoading: !state.isLoading,
      };
    case 'SET_PLAYLIST':
      return {
        ...state,
        playlist: action.payload
      }
    case 'DELETE_TRACK_FROM_PLAYLIST':
      return {
        ...state,
        playlist: { 
          ...state.playlist, 
          tracksShow: [...filterDelete(state.playlist.tracksShow, action.payload.trackId, action.payload.index)],
          tracks: [...action.payload.tracks],
        }
      }
    case 'ADD_TRACK_PLAYLIST_EDIT':
      return {
        ...state,
        playlist: {
          ...state.playlist,
          tracksShow: [...state.playlist.tracksShow, action.payload.newTrack],
          tracks: [...state.playlist.tracks, action.payload.newTrack._id]
        }
      }
    case 'SET_CURRENT_TRACK_DRAG':
      return {
        ...state,
        currentDragTrack: {
          ...action.payload
        },
      }
    case 'SET_TRACKS':  
      return {
        ...state,
        playlist: {
          ...state.playlist,
          tracksShow: [...action.payload.tracksForShowing],
          tracks: [...action.payload.tracksId],
        },
      }
    case 'ADD_PLAYLIST_RATING':
      return {
        ...state,
        playlist: {
          ...state.playlist,
          __v: action.payload.__v,
          ratings: [...action.payload.rating],
        },
      }
    case 'ADD_COMMENT_PLAYLIST':
      return {
        ...state,
        playlist: {
          ...state.playlist,
          comments: [...action.payload.comments],
        },
      }
    case 'LIKE_COMMENT_PLAYLIST':
      return {
        ...state,
        playlist: {
          ...state.playlist,
          comments: [...action.payload.comments],
        },
      };
    default:
      return {
        ...state        
      };
  }
};
