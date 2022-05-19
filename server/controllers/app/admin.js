const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
const decodeDsl = require('../../utils/decodeDsl');
const config = require('../../config');
const getOptions = require('../../utils/getOptions');
const { hashPassword } = require('../../utils/login');
const { getConnection } = require('../../db/connetDB');
const dayjs = require('dayjs');
/**@type {import('..').NormalApi} */
module.exports = {
  'post /login': async function (req, res, next) {
    const { account, password } = req.body;
    const admin = await Admin.findOne({ account }).populate('roleName');
    if (!admin) {
      res.json({ code: 402, msg: 'Account not found' });
      return;
    }

    const isSame = await bcrypt.compare(password, admin.password);
    if (!isSame) {
      res.json({ code: 402, msg: 'The password is incorrect' });
      return;
    }

    if (admin.disabled) {
      res.json({ code: 402, msg: 'The used is disabled' });
      return;
    }

    let payload = {
      // userId: admin.id,
      // expiry: new Date() * 1 + 3600000,
      user: {
        id: admin._id,
        name: admin.name,
        roleName: admin.roleName,
        exp: dayjs().add(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
      },
    };
    const token = await jwt.sign(payload, config.jwtSecretOfBack, {});
    admin.password = undefined; //相当于 select('-password')
    let result = {
      code: 0,
      msg: 'Login success',
      data: {
        token,
        admin,
      },
    };
    res.json(result);
  },
  'get /options': async function (req, res, next) {
    let data = await getOptions(Admin, { qualifyCount: { $gt: 0 } });
    return res.json({ code: 0, data });
  },
  'get /:id': async function (req, res, next) {
    var id = req.params.id;
    var data = await Admin.findById(id).select('-__v -password');
    return res.json({ code: 0, data });
  },

  'put /:id': async function (req, res, next) {
    let err = null;
    await Admin.findByIdAndUpdate(req.params.id, req.body).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: msgRemake(err) });
    res.json({ code: 0, msg: 'Modified succeeded' });
  },
  'post /updateToken': async function (req, res, next) {
    var { notifyToken } = req.body;
    let err = null;
    var after = await Admin.findByIdAndUpdate(res.locals.userId, { notifyToken }).catch(
      e => (err = e)
    );
    if (err) return res.json({ code: 1, msg: err.message });

    return res.json({ code: 0 });
  },
};
