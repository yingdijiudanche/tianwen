const Permit = require('../../models/permit');
const Booking = require('../../models/booking');
const decodeDsl = require('../../utils/decodeDsl');
const getPageData = require('../../utils/getPageData');
const { PermitType } = require('../../enums');

/**@type {import('..').NormalApi} */
module.exports = {
  'get ': async function (req, res, next) {
    const { id } = req.query;
    const data = await Permit.findOne({ _id: id }).populate('booking');
    res.status(200).json({ code: 0, data });
  },
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    let { timeFrom, timeTo, ...rest } = condition;
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    if (timeFrom || timeTo) {
      let bookingFilter = {};
      timeFrom && (bookingFilter.timeFrom = timeFrom), timeTo && (bookingFilter.timeTo = timeTo);
      const bookings = await Booking.find(bookingFilter);
      rest.bookingId = { $in: bookings.map(b => b._id) };
    }

    const result = await getPageData(
      Permit,
      {
        ...rest,
        type: PermitType.Booking,
        sort: { addTime: -1 },
      },
      {
        populate: 'booking admin',
      }
    );

    res.json(result);
  },
};
