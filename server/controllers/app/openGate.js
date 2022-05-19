const dayjs = require('dayjs');
const mongoose = require('mongoose');
const Permit = require('../../models/permit');
const Admin = require('../../models/admin');
const InOut = require('../../models/inOut');
const Spot = require('../../models/spot');
const Vehicle = require('../../models/vehicle');
const SystemLog = require('../../utils/SystemLog');
// const decodeDsl = require('../../utils/redisHelper');
const { sendCarState } = require('../../handler/parking');

const { PermitStatus, InOutEnum, InOutType, PermitType } = require('../../enums');

module.exports = {
  // 判断是否开闸
  'post /': async function (req, res, next) {
    const { event, licenceNumber, token, timestamp } = req.body;
    SystemLog(
      req,
      res,
      'post /openGate',
      1,
      1,
      `event: ${event}, licenceNumber: ${licenceNumber}, token: ${token}, timestamp: ${timestamp}`
    );

    if (!licenceNumber) return res.json({ code: -1, msg: 'Missing Licence Number' });
    if (!event) return res.json({ code: -2, msg: 'Missing event' });
    if (event.toLocaleLowerCase() != 'in' && event.toLocaleLowerCase() != 'out')
      return res.json({ code: -3, msg: 'Invalid Event' });
    if (!token) return res.json({ code: -4, msg: 'Missing token' });
    if (!timestamp) return res.json({ code: -5, msg: 'Missing timestamp' });

    const admin = await Admin.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(token) } },
      {
        $lookup: {
          from: 'permits',
          let: { adminId: '$_id' },
          as: 'permit',
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$adminId', '$$adminId'] },
                $and: [
                  {
                    $or: [
                      { status: PermitStatus.Outing },
                      { status: PermitStatus.Waiting },
                      { status: PermitStatus.WaitForOut },
                    ],
                  },
                  { type: PermitType.Booking },
                ],
              },
            },
            {
              $lookup: {
                from: 'bookings',
                let: {
                  bookingId: '$bookingId',
                },
                as: 'booking',
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$bookingId'],
                      },
                    },
                  },
                ],
              },
            },
            { $unwind: '$booking' },
          ],
        },
      },
      { $unwind: '$permit' },
    ]);
    const permit = admin[0]
      ? admin[0].permit
      : await Permit.findOne({ _id: token }).populate('booking visitor');

    if (!permit) return res.json({ code: -13, msg: 'Invalid token' });

    let result = { code: 0, data: { authorized: true } };

    if (event.toLocaleLowerCase() === 'out') {
      // 判断有效时间是否过期
      // if (dayjs(timestamp).isAfter(dayjs(permit.activeTo)))
      //   result = { code: -9, msg: 'Active time expired' };
      // if (dayjs(timestamp).isBefore(dayjs(permit.activeFrom)))
      //   result = { code: -10, msg: 'Active time not started' };
      if (permit.type === PermitType.Booking) {
        // if (permit.status !== PermitStatus.WaitForOut) result = { code: -11, msg: 'No booking' };
        // 判断预约时间是否已过
        // if (dayjs(permit.booking.timeFrom).diff(dayjs(timestamp), 'minute') >= 30)
        //   result = { code: -8, msg: 'Booking time not started' };
        // if (dayjs(permit.booking.timeTo).diff(dayjs(timestamp), 'minute') <= 30)
        //   result = { code: -12, msg: 'Booking time expired' };
        // if (permit.licenceNumber != licenceNumber)
        //   result = { code: -7, msg: 'Invalid licence number' };
        // if (!permit.booking.beforSOC || !permit.booking.beforTotalMileage)
        //   result = { code: -14, msg: 'No befor SOC or total mileage' };
      }
    } else {
      // 停車場滿車時不放闸
      // 全部車位
      const total = await Spot.countDocuments();
      // 有車的停車位
      const inTotal = await Spot.countDocuments({ status: 'In' });
      if (total === inTotal) return (result = { code: -15, msg: 'Parking lot is full' });

      // 如果为访客车
      if (permit.visitor) {
        if (!permit.visitor.carPlateNos.find(f => f.licenceNumber === licenceNumber))
          result = { code: -7, msg: 'Invalid licence number' };
      }
    }

    const inout = new InOut({
      event,
      status: result.code ? InOutEnum.abnormal : InOutEnum.normal,
      msg: result.msg || 'Successful',
      licenceNumber,
      scanningTime: timestamp,
      permitId: permit ? permit._id : null,
      type: admin[0] ? InOutType.driver : permit ? InOutType.visitor : InOutType.other,
    });
    await inout.save();

    var carInfo = {
      vehicle: null,
      licenceNumber,
    };
    var eventInfo = {
      event: event,
      timestamp,
    };
    if (!result.code) sendCarState(eventInfo, carInfo, 0);
    res.json(result.code ? { ...result, authorized: false } : result);
  },
};
