const ContractingBusinessDept = require('../../models/contractingBusinessDept');
const decodeDsl = require('../../utils/decodeDsl');
const getPageData = require('../../utils/getPageData');
const getOptions = require('../../utils/getOptions');

/**@type {import('..').NormalApi} */
module.exports = {
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    const result = await getPageData(ContractingBusinessDept, condition);
    res.json(result);
  },
  'get /options': async function (req, res, next) {
    let result = await getOptions(ContractingBusinessDept, undefined, {
      sort: { addTime: -1 },
      selector: '_id value',
    });
    res.json(result);
  },
};
