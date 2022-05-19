import { of, concat } from 'rxjs';
import { exhaustMap, map, catchError, tap, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import { FETCH_MENUS } from '../../constants/ActionTypes';
import { handleResponseError } from '../actions/apiResponse';
import { fetchMenusSuccess, fetchMenusFailure } from '../actions/menu';

const menuEpic = (action$, state$, { getJSON }) =>
  action$.pipe(
    ofType(FETCH_MENUS),
    exhaustMap(action => {
      const roleId = action.payload;
      return getJSON(`/menu/${roleId}`).pipe(
        map(res => res),
        tap(res => {
          if (res.code) {
            throw { status: 401 };
          }
        }),
        mergeMap(res => concat(of(fetchMenusSuccess(res.data)))),
        catchError(err => concat(of(handleResponseError(err)), of(fetchMenusFailure())))
      );
    })
  );

export default combineEpics(menuEpic);