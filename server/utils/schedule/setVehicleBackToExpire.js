const dayjs = require('dayjs');
const Permit = require('../../models/permit');
const SystemLog = require('../../models/systemLog');
const Message = require('../../models/message');
const { PermitStatus, PermitType } = require('../../enums');
const { send2One } = require('../sendAppNotify');

async function getBackPermits() {
  const permits = await Permit.aggregate([
    {
      $match: {
        status: PermitStatus.WaitForOut,
        type: PermitType.Booking,
      },
    },
    {
      $lookup: {
        from: 'bookings',
        let: { id: '$bookingId' },
        as: 'booking',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$id'],
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'admins',
        let: { id: '$adminId' },
        as: 'admin',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$id'],
              },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'inouts',
        let: { permitId: '$_id' },
        as: 'in',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$permitId', '$$permitId'],
              },
              event: /^in/i,
              passingTime: {
                $exists: true,
                $ne: null,
              },
            },
          },
          {
            $sort: { addTime: -1 },
          },
        ],
      },
    },
    { $unwind: '$booking' },
    { $unwind: '$in' },
    { $unwind: '$admin' },
  ]);
  return permits;
}

/**
 * 设置过期车辆状态
 */
async function setBackToParkingLotBooking() {
  const backPermits = await getBackPermits();
  if (backPermits.length) {
    let err = null;
    const backPermitExpiration = backPermits.filter(permit => {
      if (dayjs().diff(dayjs(permit.in.passingTime), 'minute') > 15) return true;
      return false;
    });
    const messages = backPermitExpiration.map(permit => {
      return {
        adminId: permit.admin._id,
        title: 'Booking Expiration notice',
        summary: 'One booking has expired',
        richText:
          'You have returned to the parking lot for more than 15 minutes, please enter the total mileage and remaining power on the app',
        navigateTo: 'history',
        data: permit._id.toString(),
      };
    });
    if (!messages.length) return;
    Message.insertMany(messages)
      .then(datas => {
        datas.forEach(data => {
          send2One(
            backPermitExpiration.find(f => f.admin._id.toString() === data.adminId.toString()).admin
              .notifyToken,
            data.title,
            data.richText,
            {
              msgId: data._id.toString(),
              navigateTo: data.navigateTo,
              data: data.data,
            }
          );
        });
      })
      .catch(e => (err = e));

    if (err) {
      SystemLog.create({
        location: 'utils/schedule/setBackToParkingLotBooking',
        type: 0,
        source: 1,
        ip: ':0',
        content: 'Change permit status to done failed, details: ' + err.message,
        userId: null,
      });
    } else {
      await Permit.updateMany(
        { _id: { $in: backPermitExpiration.map(m => m._id) } },
        {
          $set: {
            status: PermitStatus.Done,
            inProgress: false,
          },
        }
      );
    }
  }
}

module.exports = setBackToParkingLotBooking;
