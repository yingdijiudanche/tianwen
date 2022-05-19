const baseExtra = str => str.split(',').map(v => v.split(':'));
const genSort = function (type) {
  switch (type) {
    case 'ascend':
      return 1;
    case 'descend':
      return -1;
    default:
      return 0;
  }
};
const genNumCompares = function ([min = '', max = '']) {
  let exp = {};
  if (min != '') {
    exp.$gte = +min;
  }
  if (max != '') {
    exp.$lte = +max;
  }
  return exp;
};
const genDateCompares = function ([min = '', max = '']) {
  let exp = {};
  if (min != '') {
    exp.$gte = new Date(min * 1);
  }
  if (max != '') {
    exp.$lte = new Date(max * 1);
  }
  return exp;
};
function escapeRegExpSymbol(str) {
  // return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  //str 如果包含括号会引起报错，需要转义
  return str.replace(/[.*+?{}()|[\]\\]/g, '\\$&');
}

const parserByName = {
  search: {
    extra: baseExtra,
    transform: ([k, str]) => [k, new RegExp(escapeRegExpSymbol(str), 'i')],
  },
  numRange: {
    extra: str => baseExtra(str).map(([k, v]) => [k, v.split('|')]),
    transform: ([k, range]) => [k, genNumCompares(range)],
  },
  timeRange: {
    extra: str => baseExtra(str).map(([k, v]) => [k, v.split('|')]),
    transform: ([k, range]) => [k, genDateCompares(range)],
  },
  equal: {
    extra: baseExtra,
    transform: ([k, v], str2type) => [k, str2type(k, v, 'equal')],
  },
  sort: {
    extra: baseExtra,
    transform: ([k, str]) => ['sort', { [k]: genSort(str) }],
  },
  includes: {
    extra: baseExtra,
    transform: ([k, arr], str2type) => [
      k,
      { $in: arr.split('|').map(v => str2type(k, v, 'includes')) },
    ],
  },
  notEqual: {
    extra: baseExtra,
    transform: ([k, v]) => [k, { $ne: str2type(k, v, 'notEqual') }],
  },
};

const defoConfig = {
  str2type: (k, v, kind) => v,
};
const illegalMatch = /^\$/; //不允许 $符号开口
/**
 *
 * @param {DSL} dsl
 * @param {DSLConfig} config
 * @returns {DecodedResult}
 */
function _decode({ page, limit, ...dsl }, { str2type } = defoConfig) {
  const kvs = Array.from(Object.entries(dsl));
  if (/page/.test(dsl.equal)) {
    //兼容旧版（page/limit放在equal里面）新項目不要複製這段代碼
    let { extra } = parserByName.equal;
    let kvs = extra(dsl.equal);
    let reg = /page|limit/;
    let paginate = Object.fromEntries(kvs.filter(kv => reg.test(kv[0])));
    page = paginate.page;
    limit = paginate.limit ?? 10;
    dsl.equal = kvs.filter(kv => !reg.test(kv[0])).join(':');
  }

  const kvArr = kvs
    .map(([kind, v]) => {
      let p = parserByName[kind];
      let values = p.extra(v);
      let nkv = values.map(v => p.transform(v, str2type));
      return nkv;
    })
    .flat();

  const illegalKv = kvArr.find(([k]) => illegalMatch.test(k));
  if (illegalKv) throw new Error(`Detected illegal key -> ${illegalKv[0]}`);

  const condition = Object.fromEntries(kvArr);
  return { ...condition, page, limit };
}

/**
 * 返回一个两个元素的数组，如果第二个元素不是undefined，说明解析失败，
 * @param {DSL} dsl
 * @param {DSLConfig} config
 * @returns {[DecodedResult,undefined]|[undefined,Error]|[undefined,undefined]}
 */
function decodeDsl(dsl, config) {
  if (dsl === undefined) {
    return [undefined, undefined];
  }
  try {
    const result = _decode(dsl, config);
    return [result, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

module.exports = decodeDsl;

// const [result, err] = decodeDsl(
//   { equal: '$or:18' },
//   { str2type: (k, v, kind) => (console.log(k, v, kind), +v) }
// ); //会报错
// const [resultN, errN] = decodeDsl({ equal: 'age:18' });
// console.log('🚀 ~ resultN', resultN);
// console.log('🚀 ~ result', result);
// console.log('🚀 ~ err', err);

/**
 * @typedef {object} DSL
 * @property {number} [page] 1
 * @property {number} [limit] 10
 * @property {string} [search] 'name:hh'
 * @property {string} [numRange] 'age:5|10,score:99|123'
 * @property {string} [timeRange] 'addTime:2020-01-23|2020-02-23'
 * @property {string} [equal] 'page:1,limit:10'
 * @property {string} [sort] 'begin:descend'
 * @property {string} [includes] 'begin:descend'
 * @property {string} [notEqual] 'begin:descend'
 */

/**
 * @typedef {'includes'|'notEqual'|'equal'} StrKind
 */
/**
 * @typedef {object} DSLConfig
 * @property {(k:string,v:string,kind:StrKind)=>any} [str2type] 转换那些默认字符串的类型
 */

/**
 * @typedef {object} BaseParams
 * @property {number} [page]
 * @property {number} [limit]
 * @property {Object<string,1|-1|0>} [sort]
 *
 * @typedef {BaseParams & Object<string,any>} DecodedResult
 */
