const Role = require('../../models/role');
const getOptions = require('../../utils/getOptions');

/**
 * @type {import('..').NormalApi}
 */
module.exports = {
  'get /all': async function (req, res, next) {
    const data = await Role.find({}, '-__v').lean();
    res.json({ code: 0, data });
  },
  'get /options': async function (req, res, next) {
    let data = await getOptions(Role, undefined, { sort: { level: 1 } });
    return res.json({ code: 0, data });
  },
  'post ': async function (req, res, next) {
    const role = new Role(req.body);
    let err = null;
    await role.save().catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Addtion succeeded' });
  },
  'put /:id': async function (req, res, next) {
    let err = null;
    await Role.findByIdAndUpdate(req.params.id, req.body).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Modification succeeded' });
  },
  'delete /:id': async function (req, res, next) {
    let err = null;
    await Role.findByIdAndUpdate(req.params.id, { deleFlag: Date.now() }).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Deletion succeeded' });
  },
};
