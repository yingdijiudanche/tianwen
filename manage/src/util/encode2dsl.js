const symbolReg = [
  { name: 'search', rule: /^~/, format: ([k, v]) => [k.slice(1), v] },
  { name: 'numRange', rule: /^]/, format: ([k, v]) => [k.slice(1), v.join('|')] },
  { name: 'timeRange', rule: /^#/, format: ([k, v]) => [k.slice(1), v.join('|')] }, //不能用#号
  { name: 'sort', rule: /^sort$/, format: ([k, v]) => Array.from(Object.entries(v))[0] },
  { name: 'includes', rule: /^%/, format: ([k, v]) => [k.slice(1), v.join('|')] },
  { name: 'equal', rule: /./, format: ([k, v]) => [k, Array.isArray(v) ? v[0] : v] }, //这条规则永远在最后
];
/**
 *
 * @param {[]} arr
 * @param {RegExp} rule
 * @typedef {[]} Fit
 * @typedef {[]} NotFit
 * @return {[Fit,NotFit]}
 */
const separateBydiff = function (arr, rule) {
  let fit = [],
    notFit = [];
  arr.forEach(kv => {
    let c = rule.test(kv[0]) ? fit : notFit;
    c.push(kv);
  });
  return [fit, notFit];
};

const groupByRule = function (validkvs, symbolReg) {
  let group = [];
  symbolReg.reduce((pre, cur) => {
    if (!pre.some(kv => cur.rule.test(kv[0]))) return pre; //性能优化

    let [fit, remain] = separateBydiff(pre, cur.rule);
    fit.length && group.push([cur.name, fit.map(cur.format)]);

    return remain;
  }, validkvs);
  return group;
};
/**
 * 将对象转换成 约定格式 的查询字符串
 * @see symbolReg 符号及处理方式
 * @param {Object.<string,string|number[]>} obj
 * @returns {string}
 */
const encode2dsl = ({ page, limit, ...obj }) => {
  let kvs = Array.from(Object.entries(obj));
  let validkvs = kvs.filter(([k, v]) => v != null);
  /**@type {[string,[]]>} */
  let group = groupByRule(validkvs, symbolReg);
  let dynamicQuery = group
    .reduce((pre, [name, kvs]) => {
      return `${pre}${name}=${kvs.map(kv => kv.join(':')).join(',')}&`;
    }, '')
    .slice(0, -1);
  let pageStr = page ? `&page=${page}` : '';
  let limitStr = limit ? `&limit=${limit}` : '';
  let query = dynamicQuery + pageStr + limitStr;
  query = query[0] === '&' ? query.slice(1) : query;
  return query;
};

export default encode2dsl;

/** @example  */
// let params = {
//   page: 1,
//   limit: 10,
//   ']age': [5, 10],
//   ']score': [99,null],//只取大于等于 99的
//   '#addTime': [1605530983000, 1611671547842],
//   '#openTime': [null, 1611671547842],//只取开放时间 小于等于
//   '~name': 'hh',
// };
// console.log(encode2dsl(params));
