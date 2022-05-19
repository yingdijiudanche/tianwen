const Message = require('../../models/message');
const decodeDsl = require('../../utils/decodeDsl');
const getPageData = require('../../utils/getPageData');

/**
 * @type {import('..').NormalApi}
 */
module.exports = {
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    const result = await getPageData(
      Message,
      { ...condition, adminId: res.locals.userId },
      {
        lean: true,
        select: 'title summary addTime isReaded',
      }
    );
    res.json(result);
  },
  'get /count': async function (req, res, next) {
    const count = await Message.countDocuments({ isReaded: false, adminId: res.locals.userId });
    res.json({ code: 0, data: count });
  },
  'get /:id': async function (req, res, next) {
    let data = await Message.findByIdAndUpdate(req.params.id, { isReaded: true });
    res.json({ code: 0, data });
  },
  'put /allRead': async function (req, res, next) {
    await Message.updateMany(
      {
        isReaded: false,
        adminId: res.locals.userId,
      },
      {
        $set: {
          isReaded: true,
        },
      }
    );
    res.json({ code: 0 });
  },
};
