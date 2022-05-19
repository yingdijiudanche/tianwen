import { combineEpics } from 'redux-observable';

const modules = import.meta.globEager('./*.js');
const allEpics = {};
const nameReg = /[^*/]+(?=.js)/;

for (const path in modules) {
  let key = nameReg.exec(path);
  allEpics[key] = modules[path].default;
}

export default combineEpics(...Object.values(allEpics));
