import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
} from '../../constants/ActionTypes';

const initialState = {
  loading: false,
  userName: '',
  password: '',
  user: null,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case FETCH_USER:
      return {
        ...state,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        user: payload,
      };
    case FETCH_USER_FAILURE:
      return { ...state };
    default:
      return state;
  }
};

export default reducer;
