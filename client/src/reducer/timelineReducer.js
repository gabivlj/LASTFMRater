const initialState = {
  gramps: [],
  loaded: true,
  newGramps: false,
  grampsProfile: [],
  restartTimelineProfile: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_GRAMPS':
      return {
        ...state,
        newGramps: action.payload,
      };
    case 'CLEAN_GRAMPS':
      return {
        ...state,
        gramps: [],
        loaded: true,
      };
    case 'CLEAN_GRAMPS_PROFILE':
      return {
        ...state,
        restartTimelineProfile: false,
        grampsProfile: [],
        loaded: true,
      };
    case 'SET_GRAMPS':
      return {
        ...state,
        restartTimelineProfile: false,
        gramps: [...state.gramps, ...action.payload],
        loaded: true,
      };
    case 'RESTART_TIMELINE_LOADING':
      return {
        ...state,
        restartTimelineProfile: true,
      };
    case 'LOADING_TIMELINE':
      return {
        ...state,
        loaded: !state.loaded,
      };
    case 'LOADING_TIMELINE_PROFILE':
      return {
        ...state,
        loaded:
          action.payload !== undefined && action.payload !== null
            ? action.payload
            : !state.loaded,
      };
    case 'SET_GRAMPS_PROFILE':
      return {
        ...state,
        restartTimelineProfile: false,
        grampsProfile: [...state.grampsProfile, ...action.payload],
        loaded: true,
      };
    default:
      return {
        ...state,
      };
  }
};
