const Inout = require('../../models/inOut');
const decodeDsl = require('../../utils/decodeDsl');
const getPageData = require('../../utils/getPageData');

/**@type {import('..').NormalApi} */
module.exports = {
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    const result = await getPageData(Inout, condition, {
      populate: [
        {
          path: 'permit',
          populate: [
            {
              path: 'admin',
              populate: 'driverName',
            },
          ],
        },
      ],
    });
    res.json(result);
  },
};
