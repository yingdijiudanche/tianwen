import {
  FETCH_MENUS,
  FETCH_MENUS_SUCCESS,
  FETCH_MENUS_FAILURE,
} from '../../constants/ActionTypes';

export const fetchMenus = (options) => ({
  type: FETCH_MENUS,
  payload: options,
});

export const fetchMenusSuccess = (records) => ({
  type: FETCH_MENUS_SUCCESS,
  payload: records,
});

export const fetchMenusFailure = () => ({
  type: FETCH_MENUS_FAILURE,
});
