const Vehicle = require('../../models/vehicle');
const decodeDsl = require('../../utils/decodeDsl');
const getPageData = require('../../utils/getPageData');

/**@type {import('..').NormalApi} */
module.exports = {
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    const result = await getPageData(Vehicle, condition);
    res.json(result);
  },
  'get /:id': async function (req, res, next) {
    const data = await Vehicle.findOne({ _id: req.params.id }).populate('roleName');
    res.status(200).json({ code: 0, data });
  },
  'post ': async function (req, res, next) {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.sendStatus(200);
  },
  'put /:id': async function (req, res, next) {
    let { ...body } = req.body;
    await Vehicle.findByIdAndUpdate(req.params.id, body);
    res.sendStatus(200);
  },
  'delete /:id': async function (req, res, next) {
    await Vehicle.findByIdAndUpdate(req.params.id, { deleFlag: Date.now() });
    res.sendStatus(200);
  },
};
