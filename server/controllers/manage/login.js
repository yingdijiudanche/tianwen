const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const Admin = require('../../models/admin');

const ignoreKeys = '-__v -password';
/**@type {import('..').NormalApi} */
module.exports = {
  'post ': async function (req, res, next) {
    let authorization = req.headers.Authorization || req.headers.authorization;
    if (authorization) {
      let authorizations = authorization.toString().split(' ');
      if (authorizations[0] === 'Basic') {
        let account = Buffer.from(authorizations[1], 'base64').toString().split(':');
        let user = await Admin.findOne({
          account: account[0],
          disabled: { $exists: true },
        }).populate('roleName');
        if (!user) {
          res.json({ code: 402, msg: 'Account not found' });
          return;
        }

        if (user.deleFlag || user.disabled) {
          res.json({ code: 402, msg: 'Account is disabled or deleted' });
          return;
        }

        const isSame = await bcrypt.compare(account[1], user.password);
        if (!isSame) {
          res.json({ code: 402, msg: 'The password is incorrect' });
          return;
        }

        let token = jwt.sign(
          {
            user: {
              id: user._id,
              name: user.name,
              roleName: user.roleName,
              exp: dayjs().add(30, 'day').format('YYYY-MM-DD HH:mm:ss'),
            },
          },
          config.jwtSecretOfBack
        );
        user.password = undefined;
        const result = {
          code: 0,
          token,
          user,
        };
        return res.json(result);
      }
      res.json({ code: -1 });
    } else {
      res.json({ code: -1 });
    }
  },
};
