import { HANDLE_RESPONSE_ERROR } from '../../constants/ActionTypes';

export const handleResponseError = (error, options) => ({
  type: HANDLE_RESPONSE_ERROR,
  payload: { error, options },
});
