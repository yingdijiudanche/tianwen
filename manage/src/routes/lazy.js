// const first = import.meta.glob('./*.jsx')
// const first = import.meta.globEager('./*.jsx');
import asyncComponent from "../util/asyncComponent";

const second = import.meta.glob('./*/*.jsx');
const third = import.meta.glob('./*/*/*.jsx');

const linkReg = /[^./](\S*)(?=.jsx)/;
const lazyPagesKeyValue = {};

function conver2obj(modules) {
  for (const path in modules) {
    let key = linkReg.exec(path)[0];
    // lazyPagesKeyValue[key] = modules[path].default;
    lazyPagesKeyValue[key] = asyncComponent(() => modules[path]());
  }
}
// conver2obj(first);
conver2obj(second);
conver2obj(third);
export default lazyPagesKeyValue;
