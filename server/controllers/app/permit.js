/**@type {import('..').NormalApi} */
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const { Dayjs } = require('dayjs');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
const Permit = require('../../models/permit');
const Admin = require('../../models/admin');
const Booking = require('../../models/booking');
const Spot = require('../../models/spot');
const Vehicle = require('../../models/vehicle');
const decodeDsl = require('../../utils/decodeDsl');
const getPageData = require('../../utils/getPageData');
const { setBookingInfo } = require('../../handler/parking');
const { PermitStatus, parkingSpaceState, PermitType } = require('../../enums');

module.exports = {
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    const result = await getPageData(
      Permit,
      { ...condition, type: PermitType.Booking, adminId: res.locals.userId },
      {
        populate: [
          { path: 'booking', model: 'Booking' },
          { path: 'vehicle', model: 'Vehicle', populate: [{ path: 'spot', model: 'Spot' }] },
        ],
      }
    );
    res.json(result);
  },
  'get /:id': async function (req, res, next) {
    const data = await Permit.findOne({ _id: req.params.id }).populate([
      { path: 'booking admin inOuts spot' },
      { path: 'vehicle', model: 'Vehicle', populate: [{ path: 'spot', model: 'Spot' }] },
    ]);
    res.json({ code: 0, data });
  },
  'post /oldBooking': async function (req, res, next) {
    const body = req.body;
    const admin = await Admin.findOne({ _id: res.locals.userId }).populate('driver');
    if (!admin.driver && res.locals.roleName !== 'TestDriver')
      return res.json({ code: 1, msg: 'No permission' });
    if (body.passenger > 6) return res.json({ code: 1, msg: 'No more than 6 passengers' });
    // 有车的情况：人数、电量（多的优先booking）、当前车有没有被booking、是否为访客车、靠墙车需判断前车位有无车(若无其它车可booking，依旧可booking)
    // 如果booking的车未还车、那停车场的管理人员可帮忙改车booking
    // 约车需整点，预约时间分小节：以每小时为一小节、实际用车时间需要 - 15分钟。

    // 用户当前的预约时间
    const bookingTimeFrom = dayjs(body.timeFrom);
    const bookingTimeTo = dayjs(body.timeTo);

    // 用聚合做初步筛选，条件：停车场是否有车(is pool car)、载客量
    const inCars = await Spot.aggregate([
      {
        $match: { status: parkingSpaceState.IN, vehicleId: { $ne: null } },
      },
      { $sort: { returnTime: 1 } },
      {
        $lookup: {
          from: 'vehicles',
          let: { id: '$vehicleId' },
          as: 'vehicle',
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$id'],
                },
                isPoolCar: true,
                patronageRidership: body.passenger > 4 ? 6 : 4,
              },
            },
            {
              $lookup: {
                from: 'permits',
                let: { vehicleId: '$_id' },
                as: 'permits',
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$vehicleId', '$$vehicleId'],
                      },
                      // $ne: ['$status', PermitStatus.Waiting],
                      status: PermitStatus.Waiting,
                    },
                  },
                  // 获取最新的一条Permit
                  { $sort: { addTime: -1 } },
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
          ],
        },
      },
      { $unwind: '$vehicle' },
      // 排除有预约时间冲突的车，没找到合适的函数
    ]);
    // .sort((a, b) => { // 暂时还无法按照电量来排序，因为当前Permit只取Waiting状态的，没取最近一次还车的剩余电量
    //   //用电量排序 perimits 已按预约时间最早的排序一次，取第一个即可
    //   let num1 = a.vehicle.perimits.length ? a.vehicle.perimits[0].booking.SOC : 0,
    //     num2 = b.vehicle.perimits.length ? b.vehicle.perimits[0].booking.SOC : 0;
    //   return num2 - num1;
    // });

    // 预约停车场的车
    let car = await getInCar(inCars, bookingTimeFrom);

    // 停车场没车的情况：查询有预约的车
    if (!car) {
      car = await getBookingCar(body.passenger, bookingTimeFrom, bookingTimeTo);
    }

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let err = null;

      const bookingAction = new Booking({ ...body });
      bookingAction.$session(session);
      let bookingEntity = await bookingAction.save().catch(e => (err = e));
      if (err) throw err;

      const permitAction = new Permit({
        booking: body,
        driverId: admin.driver._id,
        adminId: res.locals.userId,
        vehicleId: car.vehicleId,
        bookingId: bookingEntity._id,
        licenceNumber: car.licenceNumber,
        //可提前30分钟取车
        activeFrom: dayjs(body.timeFrom).add(-30, 'minute'),
        activeTo: dayjs(body.timeFrom).add(1, 'day'),
        status: PermitStatus.Waiting,
      });
      permitAction.$session(session);
      await permitAction.save().catch(e => (err = e));
      if (err) throw err;
    });

    await setBookingInfo();
    res.json({ code: 0 });
  },
  'post /booking': async (req, res, next) => {
    const body = req.body;
    const admin = await Admin.findOne({ _id: res.locals.userId }).populate([
      { path: 'driver' },
      { path: 'permits', match: { type: PermitType.Booking }, populate: { path: 'booking' } },
    ]);
    if (!admin.driver && res.locals.roleName !== 'TestDriver')
      return res.json({ code: 1, msg: 'No permission' });
    if (body.passager > 6) return res.json({ code: 1, msg: 'No more than 6 passagers' });
    // 判断booking是否有冲突的时间
    const bookingTimeFrom = dayjs(body.timeFrom);
    const bookingTimeTo = dayjs(body.timeTo);
    if (
      admin.permits.find(
        permit =>
          (dayjs(permit.booking.timeFrom).isBefore(bookingTimeFrom) &&
            dayjs(permit.booking.timeTo).isAfter(bookingTimeFrom)) ||
          (dayjs(permit.booking.timeFrom).isBefore(bookingTimeTo) &&
            dayjs(permit.booking.timeTo).isAfter(bookingTimeTo)) ||
          (dayjs(permit.booking.timeFrom).isSameOrAfter(bookingTimeFrom) &&
            dayjs(permit.booking.timeTo).isSameOrBefore(bookingTimeTo))
      )
    )
      return res.json({ code: 1, msg: 'You have an appointment for the current time slot' });

    // return res.json({ code: 1, msg: 'You have an appointment for the current time slot' });
    if (dayjs(body.timeTo).diff(dayjs(body.timeFrom), 'hour') > 12)
      return res.json({ code: 1, msg: 'Booking time no more than 12 hours' });
    let status = PermitStatus.WaitForCheck;
    if (
      dayjs(body.timeFrom).isSameOrBefore(dayjs().add(30, 'minute')) ||
      dayjs(body.timeFrom).isSameOrBefore(dayjs().add(-10, 'minute'))
    ) {
      status = PermitStatus.Checking;
    }

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let err = null;

      const bookingAction = new Booking({ ...body });
      bookingAction.$session(session);
      let bookingEntity = await bookingAction.save().catch(e => (err = e));
      if (err) throw err;

      const permitAction = new Permit({
        // driverId: admin.driver._id,
        adminId: res.locals.userId,
        bookingId: bookingEntity._id,
        type: PermitType.Booking,
        //可提前30分钟取车
        activeFrom: dayjs(body.timeFrom).add(-30, 'minute'),
        activeTo: dayjs(body.timeFrom).add(1, 'day'),
        status: status,
      });
      permitAction.$session(session);
      await permitAction.save().catch(e => (err = e));
      if (err) throw err;
    });

    await setBookingInfo();
    res.json({ code: 0 });
  },
  'put /checkIn/:id': async (req, res, next) => {
    const body = req.body;
    const permit = await Permit.findOne({ _id: req.params.id }).populate('booking');
    if (!permit) return res.json({ code: -1, msg: 'No permit' });
    if (permit.vehicleId) return res.json({ code: -1, msg: 'Checked already' });

    // 用户当前的预约时间
    const bookingTimeFrom = dayjs(permit.booking.timeFrom);
    const diffTime = bookingTimeFrom.diff(dayjs(), 'minute');
    if (diffTime > 30) return res.json({ code: 1, msg: 'Only 30 minutes early check-in' });
    if (diffTime < -15) return res.json({ code: 1, msg: 'No more than 15 minutes to check in' });

    // TODO... 判断当前driver驾驶类型再分配自动或手动挡车

    const inCars = await Spot.aggregate([
      {
        $match: { status: parkingSpaceState.IN, vehicleId: { $ne: null } },
      },
      { $sort: { returnTime: 1 } },
      {
        $lookup: {
          from: 'vehicles',
          let: { id: '$vehicleId' },
          as: 'vehicle',
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$id'],
                },
                isPoolCar: true,
                patronageRidership: body.passenger > 4 ? 6 : 4,
                $or: [{ isSpare: false }, { isSpare: { $exists: false } }],
              },
            },
            {
              $lookup: {
                from: 'permits',
                let: { vehicleId: '$_id' },
                as: 'permits',
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$vehicleId', '$$vehicleId'],
                      },
                      $or: [{ status: PermitStatus.Waiting }, { status: PermitStatus.WaitForOut }],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      { $unwind: '$vehicle' },
      {
        $match: {
          'vehicle.permits': { $size: 0 },
        },
      },
    ]);

    if (!inCars.length) return res.json({ code: -1, msg: 'No cars left' });
    await Permit.findByIdAndUpdate(req.params.id, {
      vehicleId: inCars[0].vehicleId,
      licenceNumber: inCars[0].licenceNumber,
      status: PermitStatus.Waiting,
      checkInTime: new Date(),
    });

    await setBookingInfo();
    return res.json({
      code: 0,
      data: { spot: inCars[0] },
    });
  },
  'put /booking/:id': async function (req, res, next) {
    let { ...body } = req.body;
    const data = await Permit.findOne({ _id: req.params.id });
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      let err = null;
      await Permit.updateOne(
        { _id: data.id },
        {
          $set: {
            status: body.type === 1 ? PermitStatus.WaitForOut : PermitStatus.Done,
            inProgress: body.type === 1 ? true : false,
            checkOutTime: body.type === 1 ? null : dayjs().toDate(),
          },
        }
      )
        .session(session)
        .catch(e => (err = e));
      if (err) throw err;

      await Booking.updateOne(
        { _id: data.bookingId },
        {
          $set: {
            [body.type === 1 ? 'beforSOC' : 'afterSOC']: body.SOC,
            [body.type === 1 ? 'beforTotalMileage' : 'afterTotalMileage']: body.totalMileage,
            mileage: body.type === 1 ? 0 : body.mileage,
            usedPower: body.type === 1 ? 0 : body.usedPower,
            checkOutTime: body.type === 1 ? null : dayjs().toDate(),
          },
        }
      )
        .session(session)
        .catch(e => (err = e));
      if (err) throw err;
    });

    await setBookingInfo();

    res.json({
      code: 0,
    });
  },
};

/**
 * 预约停车场的车
 * @param {Array} inCars 目前已经停在停车场的车辆
 * @param {Dayjs} bookingTimeFrom 用户预约的开始时间
 * @returns {Object} 车辆信息
 */
const getInCar = async (inCars, bookingTimeFrom) => {
  // 一、
  // 获取无预约，非靠墙的车（优先派送）
  let car = inCars.find(f => !f.frontSpotNo && !f.vehicle.permits.length);

  // 二、
  // 查询停车场靠墙车前面是否有停车
  const fontCars = await Spot.find({
    spotNo: { $in: inCars.map(f => f.frontSpotNo) },
    status: parkingSpaceState.IN,
  });
  if (!car) {
    // 靠墙无预约车
    let hasFrontCars = inCars.filter(f => f.frontSpotNo && !f.vehicle.permits.length);
    // 获取靠墙车前面车位没有停车的车，若无匹配项，前方有车也依旧派送
    car =
      hasFrontCars.find(h => fontCars.findIndex(f => f.spotNo === h.frontSpotNo) === -1) ||
      hasFrontCars[0];
  }

  // 三、
  // 有预约的车
  // if (!car) {
  //   let bookingCars = inCars
  //     .filter(f => f.vehicle.permits.length)
  //     .sort((a, b) => {
  //       // 当前permits是按照预约时间降序排的，而取出还车时间与当前预约时间最近的车，需要做两次对比，用当前的预约时间跟permits里的对比，对比完再对比两个permit
  //       let apermit = a.vehicle.permits.find(f => bookingTimeFrom.isSameOrAfter(f.booking.timeTo));
  //       let bpermit = b.vehicle.permits.find(f => bookingTimeFrom.isSameOrAfter(f.booking.timeTo));
  //       // 返回当前最早拿车并且最早还车的预约车
  //       return (apermit && apermit.booking.timeTo) || 0 - (bpermit && bpermit.booking.timeTo) || 0;
  //       // return dayjs(apermit.booking.timeTo).isSameOrBefore(dayjs(bpermit.booking.timeTo));
  //     });
  //   // 获取有预约，但预约相隔时间长的车，用预约时间排序后得出第一辆车（依旧是无靠墙优先派，但这个不能决定取车时是否靠墙，仅用来解决即将需要用车的预约）。
  //   car = bookingCars.find(h => fontCars.findIndex(f => f.spotNo === h.frontSpotNo) === -1) || bookingCars[0];
  // }

  return car;
};

/**
 * 当停车场无车预约时
 * @param {Number} passenger
 * @param {Dayjs} bookingTimeFrom
 * @param {Dayjs} bookingTimeTo
 */
const getBookingCar = async (passenger, bookingTimeFrom, bookingTimeTo) => {
  const vehicles = (
    await Vehicle.aggregate([
      {
        $match: {
          isPoolCar: true,
          patronageRidership: passenger > 4 ? 6 : 4,
        },
      },
      {
        $lookup: {
          from: 'permits',
          let: { vehicleId: '$_id' },
          as: 'permits',
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$vehicleId', '$$vehicleId'],
                },
                status: {
                  $in: [PermitStatus.Waiting, PermitStatus.Outing],
                },
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
            { $sort: { 'booking.timeFrom': -1 } },
          ],
        },
      },
    ])
  ).filter(f => {
    // 将有预约时间冲突的车排除
    if (!f.permits.length) return true;
    return !f.permits.find(
      permit =>
        (dayjs(permit.booking.timeFrom).isBefore(bookingTimeFrom) &&
          dayjs(permit.booking.timeTo).isAfter(bookingTimeFrom)) ||
        (dayjs(permit.booking.timeFrom).isBefore(bookingTimeTo) &&
          dayjs(permit.booking.timeTo).isAfter(bookingTimeTo)) ||
        (dayjs(permit.booking.timeFrom).isSameOrAfter(bookingTimeFrom) &&
          dayjs(permit.booking.timeTo).isSameOrBefore(bookingTimeTo))
    );
  });

  let bookingCars = vehicles.sort((a, b) => {
    // 当前permits是按照预约时间降序排的，而取出还车时间与当前预约时间最近的车，需要做两次对比，用当前的预约时间跟permits里的对比，对比完再对比两个permit
    let apermit = a.permits.find(f => bookingTimeFrom.isSameOrAfter(f.booking.timeTo));
    let bpermit = b.permits.find(f => bookingTimeFrom.isSameOrAfter(f.booking.timeTo));
    // 返回当前最早拿车并且最早还车的预约车
    let time1 = (apermit && apermit.booking.timeTo) || 0,
      time2 = (bpermit && bpermit.booking.timeTo) || 0;
    return time1 - time2;
    // return dayjs(apermit.booking.timeTo).isSameOrBefore(dayjs(bpermit.booking.timeTo));
  });
  // 获取有预约，但预约相隔时间长的车，用预约时间排序后得出第一辆车。
  return bookingCars[0];
};
