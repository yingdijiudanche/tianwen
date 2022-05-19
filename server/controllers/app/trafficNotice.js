const TrafficNotice = require('../../models/trafficNotice');
const decodeDsl = require('../../utils/decodeDsl');
const getPageData = require('../../utils/getPageData');
/**@type {import('..').NormalApi} */
module.exports = {
  'get /app/trafficNotice/list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    const result = await getPageData(Spot, condition, {}, res);

    res.json(result);
  },
  'get /app/trafficNotice/:id': async function (req, res, next) {
    const id = req.params.id;
    if (!id) {
      return res.json({
        code: -1,
        msg: 'Invalid Traffic Notice',
      });
    }
    const trafficNotice = await TrafficNotice.findById(id);
    if (!trafficNotice) {
      return res.json({
        code: -1,
        msg: 'Invalid Traffic Notice',
      });
    }
    res.json({
      code: 0,
      data: trafficNotice,
    });
  },
};
