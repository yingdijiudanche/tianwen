const VehicleType = require('../../models/vehicleType');
const decodeDsl = require('../../utils/decodeDsl');
const getOptions = require('../../utils/getOptions');
const getPageData = require('../../utils/getPageData');

/**@type {import('..').NormalApi} */
module.exports = {
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    const result = await getPageData(VehicleType, condition);
    res.json(result);
  },
  'get /options': async function (req, res, next) {
    const data = await VehicleType.find().lean();
    return res.json({ code: 0, data: data.map(item => ({ label: item.type, value: item._id })) });
  },
  'post ': async function (req, res, next) {
    const type = new VehicleType(req.body);
    await type.save();
    res.sendStatus(200);
  },
  'put /:id': async function (req, res, next) {
    let { ...body } = req.body;
    await VehicleType.findByIdAndUpdate(req.params.id, {
      ...body,
      lastUpdateBy: res.locals.userName,
    });
    res.sendStatus(200);
  },
  'delete /:id': async function (req, res, next) {
    await VehicleType.findByIdAndUpdate(req.params.id, { deleFlag: Date.now() });
    res.sendStatus(200);
  },
};
