const initialState = {
  suggestions: [],
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SUGGESTIONS':
      return {
        ...state,
        suggestions: action.payload,
      };
    case 'SET_LOADING_SUGGESTIONS':
      return {
        ...state,
        loading: !state.loading,
      };
    default:
      return { ...state };
  }
};
