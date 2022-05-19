const Spot = require('../models/spot');
const Permit = require('../models/permit');
const Vehicle = require('../models/vehicle');
const { parkingSpaceState, PermitStatus, PermitType } = require('../enums');
let wss = null;
let parkingLotInfo = {
  totalSpot: 0,
  freeSpot: 0,
  usedSpot: 0,
};
const initSpot = async ws => {
  await initParkingLotInfo();
  if (ws) {
    wss = ws;
  }
  return { code: 'parkingLotInfo', data: parkingLotInfo };
};
const initParkingLotInfo = async () => {
  const spots = await Spot.find({});
  parkingLotInfo.totalSpot = spots.length;
  parkingLotInfo.freeSpot = spots.filter(spot => spot.status.toUpperCase() === 'OUT').length;
  parkingLotInfo.usedSpot = spots.filter(spot => spot.status.toUpperCase() === 'IN').length;
};
const getParkingLotInfo = () => {
  return parkingLotInfo;
};

/**
 *
 *
 * @return {*} 发送停车场车辆信息汇总
 */
const sendParkingLotInfo = async () => {
  await initParkingLotInfo();
  if (!wss) return;
  wss.broadcast(JSON.stringify({ code: 'parkingLotInfo', data: parkingLotInfo }));
};

/**
 *
 *
 * @param {*}   eventInfo 事件信息{ event, spotNo, timestamp }
 * @param {*}   carInfo   车辆信息{ vehicle, licenceNumber }
 * @param {0|1|2} state   事件类型   0: 停车场开闸  1: 开闸并出(入)场  2:车位进出
 * @return {*}
 */
const sendCarState = async (eventInfo, carInfo, state) => {
  if (!wss) return;
  var { event, spotNo, timestamp } = eventInfo;
  var { vehicle, licenceNumber } = carInfo;

  var info = {
    event,
    state,
    spotNo,
    timestamp,
    vehicle,
    licenceNumber,
  };
  wss.broadcast(JSON.stringify({ code: 'parking', data: info }));
};
const setBookingInfo = async () => {
  const total = await Vehicle.countDocuments({
    isPoolCar: true,
    $or: [{ isSpare: false }, { isSpare: { $exists: false } }],
  });
  const spots = await Spot.find({ status: parkingSpaceState.IN }).populate({
    path: 'vehicle',
    populate: 'permits',
  });
  const idle = spots.filter(f => {
    if (f.vehicle) {
      return !f.vehicle.permits.find(
        f => f.status === PermitStatus.Waiting || f.status === PermitStatus.WaitForOut
      );
    } else if (f.licenceNumber) {
      //若是来访车辆占用，车位显示非闲置
      return false;
    }
    return true;
  }).length;
  const checkIn = spots.filter(f => {
    if (f.vehicle) {
      return f.vehicle.permits.find(
        f => f.status === PermitStatus.Waiting || f.status === PermitStatus.WaitForOut
      );
    }
    return true;
  }).length;
  const permits = await Permit.find({
    $or: [{ status: PermitStatus.Outing }, { type: PermitType.Booking }],
  });
  const rented = permits.filter(f => f.status === PermitStatus.Outing).length;
  const booking = permits.filter(f => f.vehicleId).length;

  const res = {
    code: 'booking',
    data: {
      total,
      idle,
      checkIn,
      booking,
      rented,
    },
  };
  if (wss) {
    wss.broadcast(JSON.stringify(res));
  }
  return res;
};

const initParkingLot = async () => {
  let bookingInfo = await setBookingInfo();
  let parkingLotInfo = await initSpot();
  return [bookingInfo, parkingLotInfo];
};
carIn = async () => {};
carOut = async () => {};
module.exports = {
  initSpot,
  initParkingLot,
  getParkingLotInfo,
  sendCarState,
  sendParkingLotInfo,
  setBookingInfo,
};
