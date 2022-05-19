const qrcode = require('qrcode');
const dayjs = require('dayjs');
// const decodeDsl = require('../../utils/redisHelper');

module.exports = {
  'post /genQrcode': async function (req, res, next) {
    const { event = 'IN', licenceNumber = 'FV8154', token = 'RD2717', timestamp = '' } = req.body;
    const qc = await qrcode.toDataURL(
      `http://183.178.92.253:31015/api/pass?event=${event}&licenceNumber=${licenceNumber}&token=${token}&timestamp=${timestamp}`
    );
    // const qc = await qrcode.toDataURL(`http://localhost:50496/api/pass?name=${name}&licenceNumber=${licenceNumber}&token=${token}&time=${dayjs().unix()}`);
    res.json({ code: 0, data: qc });
  },
};
