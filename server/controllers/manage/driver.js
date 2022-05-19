const mongoose = require('mongoose');
const Driver = require('../../models/driver');
const Admin = require('../../models/admin');
const decodeDsl = require('../../utils/decodeDsl');
const getPageData = require('../../utils/getPageData');

/**@type {import('..').NormalApi} */
module.exports = {
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    const result = await getPageData(Driver, condition, { populate: 'adminName adminId' });
    res.json(result);
  },
  'get /:id': async function (req, res, next) {
    const data = await Driver.findOne({ _id: req.params.id }).populate('adminName');
    res.status(200).json({ code: 0, data });
  },
  'post ': async (req, res, next) => {
    const { adminId, ...rest } = req.body;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let err = null;

      const driverAction = new Driver({ ...rest });
      driverAction.$session(session);
      let driverEntity = await driverAction.save().catch(e => (err = e));
      if (err) throw err;

      await Admin.updateOne(
        { _id: adminId },
        {
          $set: {
            driverId: driverEntity._id,
          },
        }
      )
        .session(session)
        .catch(e => (err = e));
      if (err) throw err;
    });
    res.sendStatus(200);
  },
  'put /:id': async (req, res, next) => {
    const { adminId, ...rest } = req.body;
    const rAdminId = (await Driver.findOne({ _id: req.params.id }).populate('adminId')).adminId;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let err = null;
      let driverAction = await Driver.findByIdAndUpdate(req.params.id, { ...rest })
        .session(session)
        .catch(e => (err = e));
      if (err) throw err;

      await Admin.updateOne(
        { _id: rAdminId },
        {
          $set: {
            driverId: null,
          },
        }
      );
      await Admin.updateOne(
        { _id: adminId },
        {
          $set: {
            driverId: driverAction._id,
          },
        }
      )
        .session(session)
        .catch(e => (err = e));
      if (err) throw err;
    });

    res.sendStatus(200);
  },
  'delete /:id': async (req, res, next) => {
    let driver = await Driver.findByIdAndUpdate(req.params.id, { deleFlag: Date.now() });
    await Admin.findOneAndUpdate({ driverId: driver._id }, { $set: { driverId: null } });
    res.sendStatus(200);
  },
};
