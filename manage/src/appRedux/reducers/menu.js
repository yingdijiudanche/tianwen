import {
  FETCH_MENUS,
  FETCH_MENUS_SUCCESS,
  FETCH_MENUS_FAILURE,
} from '../../constants/ActionTypes';

const initialState = {
  menus: [],
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_MENUS:
      return {
        ...state,
      };
    case FETCH_MENUS_SUCCESS:
      return {
        ...state,
        menus: payload,
      };
    case FETCH_MENUS_FAILURE:
      return {
        ...state,
      };
    default:
      return state;
  }
}

export default reducer;