const customLabels = {
  docs: 'data',
  totalDocs: 'total',
  page: 'current',
  limit: 'pageSize',
  totalPages: false,
  nextPage: false,
  prevPage: false,
  hasPrevPage: false,
  hasNextPage: false,
  pagingCounter: false,
};
const defaultQuery = { page: 1, limit: 10 };
/**
 * 分页取数据
 * @param {import('mongoose').Model} model
 * @param {Object} query
 * @param {import('mongoose').PaginateOptions} options
 * @param {import('express').Response} res
 *
 */
module.exports = async function (
  model,
  { page, limit, sort, ...rest } = defaultOptions,
  options = {}
) {
  options = { ...options, sort, page, limit, customLabels };
  rest.deleFlag = { $exists: false };
  let pageData = await model.paginate(rest, options);
  pageData.code = 0;
  // console.log(pageData.data);
  // if (pageData.data.length) {
  //   pageData.data[0].completionDate = undefined;
  // }
  return pageData;
};

/** @see {@link[https://www.npmjs.com/package/mongoose-paginate-v2]} */
