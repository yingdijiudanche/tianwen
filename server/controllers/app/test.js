const checkBookingTime = require('../../utils/schedule/checkInNotify');

module.exports = {
  'get /notify': async function (req, res, next) {
    checkInNotify();
    res.json({ code: 0 });
  },
};
