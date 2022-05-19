import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";
import { createEpicMiddleware } from "redux-observable";

import { getJSON, get, post, del, put } from "../../util/rxAjax";
import config from '../../util/config';

import createRootReducer from "../reducers";
import rootEpic from "../epics";

import { createBrowserHistory as createHistory } from "history";

const epicMiddleware = createEpicMiddleware({
  dependencies: { getJSON, get, post, del, put },
});

export const history = createHistory({ basename: config.baseName });

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
      composeWithDevTools(
        applyMiddleware(
          routerMiddleware(history), // for dispatching history actions
          epicMiddleware
        )
      )
    )
  );

  epicMiddleware.run(rootEpic);
  return store;
}
