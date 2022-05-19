import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router'

const modules = import.meta.globEager('./*.js');
const allReducer = {};
const nameReg = /[^*/]+(?=.js)/;

for (const path in modules) {
  let key = nameReg.exec(path);
  allReducer[key] = modules[path].default;
}

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  ...allReducer
});

export default createRootReducer;
