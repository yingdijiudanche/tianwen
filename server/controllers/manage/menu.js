const Menu = require('../../models/menu');
const Role = require('../../models/role');
const decodeDsl = require('../../utils/decodeDsl');
const getPageData = require('../../utils/getPageData');
const getOptions = require('../../utils/getOptions');

/**
 * @type {import('..').NormalApi}
 */
module.exports = {
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    const result = await getPageData(Menu, condition);
    res.json(result);
  },
  'get /options': async function (req, res, next) {
    let data = await getOptions(Menu, { hidden: false }, { sort: { sort: 1 } }).catch(console.log);
    return res.json({ code: 0, data: data ?? [] });
  },
  'get /all': async function (req, res, next) {
    const menus = await Menu.find().sort({ sort: 1 }).lean();
    res.json({ code: 0, data: menus });
  },
  'get /:roleId': async function (req, res, next) {
    let err = null;
    let data = await Role.findById(req.params.roleId)
      .populate('menus')
      .catch(e => (err = e));

    if (err) return res.json({ code: 1, msg: err.message });
    if (data.menuIds.length) {
      return res.json({ code: 0, data: data.menus });
    }
    data.menus = await Menu.find().sort({ sort: 1 }).lean();
    res.json({ code: 0, data: data.menus });
  },
  'post ': async function (req, res, next) {
    const menu = new Menu(req.body);
    let err = null;
    await menu.save().catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Addtion succeeded' });
  },
  'put /:id': async function (req, res, next) {
    let err = null;
    let { ...body } = req.body;
    await Menu.findByIdAndUpdate(req.params.id, body).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Modification succeeded' });
  },
  'delete /:id': async function (req, res, next) {
    let err = null;
    await Menu.findByIdAndUpdate(req.params.id, { deleFlag: Date.now() }).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Deletion succeeded' });
  },
};
