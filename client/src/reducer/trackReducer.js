const initial = {
  track: {},
  loading: false,
};

export default (state = initial, action) => {
  const { payload, type } = action;
  switch (type) {
    case 'SET_TRACK_PAGE':
      return {
        ...state,
        track: payload,
        loading: false,
      };
    case 'CLEAN_TRACK_PAGE':
      return {
        ...state,
        track: {},
        loading: false,
      };
    case 'ERROR_GETTING_TRACK':
      return {
        ...state,
        loading: false,
      };
    case 'SET_LOADING_TRACK_PAGE':
      return {
        ...state,
        loading: true,
      };
    case 'UPDATE_TRACK':
      return {
        ...state,
        loading: false,
        track: {
          ...state.track,
          ...payload,
        },
      };
    default:
      return {
        ...state,
      };
  }
};
