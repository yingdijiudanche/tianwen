const Permit = require('../../models/permit');
const Message = require('../../models/message');
const SystemLog = require('../../models/systemLog');
const { PermitStatus, PermitType } = require('../../enums');
const { send2One } = require('../sendAppNotify');
const dayjs = require('dayjs');

async function getPermits(isCheck) {
  const permits = await Permit.aggregate([
    {
      $match: {
        [isCheck ? 'sentCheckNotify' : 'sentExpirationNotify']: false,
        vehicleId: null,
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
              timeFrom: isCheck
                ? {
                    $lte: dayjs().add(30, 'minute').toDate(),
                  }
                : {
                    $lte: dayjs().add(-10, 'minute').toDate(),
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
    { $unwind: '$booking' },
    { $unwind: '$admin' },
  ]);
  return permits;
}

// TODO... 加一个还车提醒
async function checkInNotify() {
  const checkPermits = await getPermits(true);
  if (checkPermits.length) {
    let err = null;
    const messages = checkPermits.map(permit => {
      return {
        adminId: permit.admin._id,
        title: 'Booking notice',
        summary: 'Your booking can check-in',
        richText: 'Your booking can check-in',
        navigateTo: 'history',
        data: permit._id.toString(),
      };
    });
    Message.insertMany(messages)
      .then(datas => {
        datas.forEach(data => {
          send2One(
            checkPermits.find(f => f.admin._id.toString() === data.adminId.toString()).admin
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
        location: 'utils/schedule/checkBookingTime',
        type: 0,
        source: 1,
        ip: ':0',
        content: 'insertMany messages error, details: ' + err.message,
        userId: null,
      });
    } else {
      await Permit.updateMany(
        { _id: { $in: checkPermits.map(item => item._id) } },
        { $set: { sentCheckNotify: true, status: PermitStatus.Checking } }
      );
    }
  }

  const expirationPermits = await getPermits(false);
  if (expirationPermits.length) {
    let err = null;
    const messages = expirationPermits.map(permit => {
      return {
        adminId: permit.admin._id,
        title: 'Booking expiration notice',
        summary: 'You have a booking that is about to expire',
        richText: 'You have a booking that is about to expire',
        navigateTo: 'history',
        data: permit._id.toString(),
      };
    });
    Message.insertMany(messages)
      .then(datas => {
        datas.forEach(data => {
          send2One(
            expirationPermits.find(f => f.admin._id.toString() === data.adminId.toString()).admin
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
        location: 'utils/schedule/checkBookingTime',
        type: 0,
        source: 1,
        ip: ':0',
        content: 'insertMany messages error, details: ' + err.message,
        userId: null,
      });
    } else {
      await Permit.updateMany(
        { _id: { $in: expirationPermits.map(item => item._id) } },
        { $set: { sentExpirationNotify: true } }
      );
    }
  }
}

module.exports = checkInNotify;
