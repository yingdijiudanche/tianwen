const dayjs = require('dayjs');
const Permit = require('../../models/permit');
const SystemLog = require('../../models/systemLog');
const { PermitStatus, PermitType } = require('../../enums');

async function getPermits(status) {
  const filter = {
    permit: {},
    booking: {},
  };
  switch (status) {
    case PermitStatus.Expired:
      filter.permit = {
        vehicleId: null,
        status: { $ne: PermitStatus.Expired },
      };
      filter.booking = {
        timeFrom: {
          $lte: dayjs().add(-16, 'minute').toDate(),
        },
      };
      break;
    case PermitStatus.Abnormal:
      filter.permit = {
        $or: [
          {
            status: PermitStatus.Outing,
          },
          {
            status: PermitStatus.Waiting,
          },
          {
            status: PermitStatus.WaitForOut,
          },
        ],
      };
      filter.booking = {
        timeTo: {
          $lt: dayjs().toDate(),
        },
      };
      break;
    default:
      break;
  }
  const permits = await Permit.aggregate([
    {
      $match: { ...filter.permit, type: PermitType.Booking },
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
              ...filter.booking,
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

async function setBookingStatus() {
  // 1. 即將过期但未搶車    Expired
  // 2. 已經搶車但逾時      Expired
  // 3. Outing之後，返回停車場，超過15分鐘   Expired
  // 4. Outing之後，超出Booking time to  // Abnormal

  // 将过期未check in的许可证设置为已过期
  const expirationPermits = await getPermits(PermitStatus.Expired);
  if (expirationPermits.length) {
    let err = null;
    await Permit.updateMany(
      { _id: { $in: expirationPermits.map(item => item._id) } },
      {
        $set: {
          status: PermitStatus.Expired,
          inProgress: false,
          expiredInfo: 'Expired but not check in',
        },
      }
    ).catch(e => (err = e));
    if (err) {
      SystemLog.create({
        location: 'utils/schedule/setBookingStatus-expire',
        type: 0,
        source: 1,
        ip: ':0',
        content: 'Change permit status to expired failed, details: ' + err.message,
        userId: null,
      });
    }
  }

  // 将过期未还车的许可证设置异常
  const abnormalPermits = await getPermits(PermitStatus.Abnormal);
  if (abnormalPermits.length) {
    let err = null;
    await Permit.updateMany(
      { _id: { $in: abnormalPermits.map(item => item._id) } },
      {
        $set: {
          status: PermitStatus.Abnormal,
          isExpireReturn: true,
          inProgress: false,
          abnormalInfo:
            'Contains the following - 1: The reservation time has expired and the car is not returned to the parking lot, 2: Vehicle status is in use, but booking time has expired and not been used',
        },
      }
    ).catch(e => (err = e));
    if (err) {
      SystemLog.create({
        location: 'utils/schedule/setBookingStatus-abnormal',
        type: 0,
        source: 1,
        ip: ':0',
        content: 'Change permit status to abnormal failed, details: ' + err.message,
        userId: null,
      });
    }
  }
}

module.exports = setBookingStatus;
