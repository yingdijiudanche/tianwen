import { of, concat } from 'rxjs';
import { exhaustMap, map, catchError, tap, mergeMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import { LOGIN, FETCH_USER } from '../../constants/ActionTypes';
import { handleResponseError } from '../actions/apiResponse';
import { loginSuccess, loginFailure, fetchUserSuccess, fetchUserFailure } from '../actions/admin';

import tokenHolder from '../../util/tokenHolder';

const makeCode = wording => {
  return btoa(
    encodeURIComponent(wording).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    })
  );
};

const loginEpic = (action$, state$, { post }) =>
  action$.pipe(
    ofType(LOGIN),
    exhaustMap(action => {
      const { userName, password } = action.payload;
      return post(
        '/login',
        {},
        { Authorization: `Basic ${makeCode(`${userName}:${password}`)}` }
      ).pipe(
        map(res => res.response),
        tap(res => {
          if (!res.code) {
            tokenHolder.set(res.token);
            delete res.token;
          } else {
            // eslint-disable-next-line
            throw { status: 200, msg: res.msg };
          }
        }),
        mergeMap(res => concat(of(loginSuccess(res.Data)))),
        catchError(err => concat(of(handleResponseError(err)), of(loginFailure())))
      );
    })
  );

const userEpic = (action$, state$, { getJSON }) =>
  action$.pipe(
    ofType(FETCH_USER),
    exhaustMap(action => {
      return getJSON(`/admin`).pipe(
        map(res => res),
        tap(res => {
          if (res.code) {
            throw { status: 401 };
          }
        }),
        mergeMap(res => concat(of(fetchUserSuccess(res.data)))),
        catchError(err => concat(of(handleResponseError(err)), of(fetchUserFailure())))
      );
    })
  );

export default combineEpics(loginEpic, userEpic);
