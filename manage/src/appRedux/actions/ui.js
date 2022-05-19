import { SHOW_ALERT_SNACKBAR, CLOSE_SNACKBAR } from '../../constants/ActionTypes';

export const showAlertSnackbar = (
  type,
  content,
  title,
  timeOut,
  onClick,
) => ({
  type: SHOW_ALERT_SNACKBAR,
  payload: {
    type,
    content,
    title,
    timeOut,
    onClick,
    show: true,
  },
});

export const closeSnackbar = key => ({
  type: CLOSE_SNACKBAR,
});
