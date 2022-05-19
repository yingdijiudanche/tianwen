import { of, concat } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import { HANDLE_RESPONSE_ERROR } from '../../constants/ActionTypes';
import { showAlertSnackbar } from '../actions/ui';
import tokenHolder from '../../util/tokenHolder';
import config from '../../util/config';

const handleResponseErrorEpic = (action$, state$) =>
  action$.pipe(
    ofType(HANDLE_RESPONSE_ERROR),
    concatMap(action => {
      const { error } = action.payload;
      if (error.status === 401) {
        tokenHolder.remove();
        setTimeout(() => {
          window.location.replace(`${config.baseName}/login`);
        }, 1500);
        return concat(
          of(
            showAlertSnackbar(
              'error',
              'Token expired, please login again',
              'Error',
              4.5,
              null,
            )
          )
        );
      } else if (error.status === 404) {
        return concat(
          of(
            showAlertSnackbar(
              'error',
              'Request Api 404',
              'Error',
              4.5,
              null,
            )
          )
        );
      }
      return concat(
        of(
          showAlertSnackbar(
            'error',
            error.msg || 'Request fails',
            'Error',
            4.5,
            null,
          )
        )
      );
    })
  );

export default combineEpics(handleResponseErrorEpic);
