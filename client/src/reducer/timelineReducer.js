const initialState = {
  gramps: [],
  loaded: true,
  newGramps: false,
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
    case 'SET_GRAMPS':
      return {
        ...state,
        gramps: [...state.gramps, ...action.payload],
        loaded: true,
      };
    case 'LOADING_TIMELINE':
      return {
        ...state,
        loaded: !state.loaded,
      };
    default:
      return {
        ...state,
      };
  }
};
