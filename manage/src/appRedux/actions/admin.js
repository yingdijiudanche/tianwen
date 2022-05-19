import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
} from '../../constants/ActionTypes';

export const login = options => ({
  type: LOGIN,
  payload: options,
});
export const loginSuccess = data => ({
  type: LOGIN_SUCCESS,
  payload: data,
});
export const loginFailure = () => ({
  type: LOGIN_FAILURE,
});
export const fetchUser = () => ({
  type: FETCH_USER,
});
export const fetchUserSuccess = data => ({
  type: FETCH_USER_SUCCESS,
  payload: data,
});
export const fetchUserFailure = () => ({
  type: FETCH_USER_FAILURE,
});
