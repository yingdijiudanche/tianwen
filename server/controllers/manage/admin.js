const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const decodeDsl = require('../../utils/decodeDsl');
const getPageData = require('../../utils/getPageData');
const getOptions = require('../../utils/getOptions');

const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const ignoreKeys = '-__v -password';
/**@type {import('..').NormalApi} */
module.exports = {
  'get ': async function (req, res, next) {
    let userId = res.locals.userId || '';
    const data = await Admin.findOne({ _id: userId }).populate('roleName').select(ignoreKeys);
    res.status(200).json({ code: 0, data });
  },
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    const result = await getPageData(Admin, condition, {
      populate: 'roleName',
      select: ignoreKeys,
    });
    res.json(result);
  },
  'get /options': async function (req, res, next) {
    let result = await getOptions(Admin, undefined, { sort: { addTime: -1 } });
    res.json(result);
  },
  'get /driverOptions/:id': async function (req, res, next) {
    const f =
      req.params.id === 'n'
        ? { $or: [{ driverId: null }, { driverId: { $exists: false } }] }
        : { $or: [{ driverId: null }, { driverId: { $exists: false } }, { _id: req.params.id }] };
    let result = await getOptions(Admin, f, { sort: { addTime: -1 } });
    res.json(result);
  },
  'post ': async function (req, res, next) {
    let { password } = req.body;
    req.body.password = await hashPassword(password);
    const admin = new Admin(req.body);
    let err = null;
    await admin.save().catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Addtion succeeded' });
  },
  'put /:id': async function (req, res, next) {
    let err = null;
    let { ...body } = req.body;
    await Admin.findByIdAndUpdate(req.params.id, body).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Modification succeeded' });
  },
};
