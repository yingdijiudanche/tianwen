import { SHOW_ALERT_SNACKBAR, CLOSE_SNACKBAR } from '../../constants/ActionTypes';

const initialState = {
  snackbars: {},
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SHOW_ALERT_SNACKBAR:
      return {
        ...state,
        snackbars: { ...payload },
      };
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbars: { ...state.snackbars, show: false },
      };
    default: {
      return state;
    }
  }
};

export default reducer;
