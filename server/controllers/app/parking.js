const Spot = require('../../models/spot');
const Vehicle = require('../../models/vehicle');
const decodeDsl = require('../../utils/decodeDsl');
const { sendParkingLotInfo, setBookingInfo, sendCarState } = require('../../handler/parking');
const getPageData = require('../../utils/getPageData');
const SystemLog = require('../../utils/SystemLog');
const { parkingSpaceState } = require('../../enums');
/**@type {import('..').NormalApi} */
module.exports = {
  'get /list': async function (req, res, next) {
    const [condition, decodeErr] = decodeDsl(req.query);
    if (decodeErr) {
      return res.json({ code: 1, msg: decodeErr.message });
    }
    const result = await getPageData(
      Spot,
      { ...condition, status: parkingSpaceState.IN },
      {
        populate: 'vehicle',
      },
      res
    );

    res.json(result);
  },
  'get /all': async function (req, res, next) {
    const data = await Spot.find({ status: parkingSpaceState.IN }).populate('vehicle');

    res.json({ code: 0, data });
  },
  'put /:id': async function (req, res, next) {
    var { licenceNumber, event, timestamp } = req.body;
    SystemLog(
      req,
      res,
      'put /paring',
      1,
      1,
      `Test parking, licenceNumber: ${licenceNumber}, event: ${event}, timestamp: ${timestamp}`
    );
    var id = req.params.id;
    if (!licenceNumber) {
      return res.json({
        code: -2,
        msg: 'Missing Licence Number',
      });
    }
    if (!event) {
      return res.json({
        code: -3,
        msg: 'Missing Event',
      });
    }
    if (!parkingSpaceState[event.toLocaleUpperCase()]) {
      return res.json({
        code: -4,
        msg: 'Invalid Event',
      });
    }
    if (!timestamp) {
      return res.json({
        code: -5,
        msg: 'Missing Timestamp',
      });
    }
    if (!id) {
      return res.json({
        code: -1,
        msg: 'Invalid Parking Lot',
      });
    }
    //parse id to number then check number is between 1 and 69
    const spotNo = parseInt(id);
    if (isNaN(spotNo) || spotNo < 1 || spotNo > 69) {
      return res.json({
        code: -1,
        msg: 'Invalid Parking Lot',
      });
    }

    var spot = await Spot.findOne({ spotNo: id });
    if (!spot) {
      return res.json({
        code: -1,
        msg: 'Invalid Parking Lot',
      });
    }

    const vehicle = await Vehicle.findOne({ licenceNumber });
    // 将所有当前车牌号的车OUT，避免之前的车牌号OUT之后未更新
    await Spot.updateMany(
      { licenceNumber: licenceNumber },
      {
        licenceNumber: null,
        vehicleId: null,
        returnTime: null,
        timestamp,
        status: parkingSpaceState[event],
      }
    );
    if (parkingSpaceState[event] === 'In') {
      if (vehicle) spot.vehicleId = vehicle._id;
      spot.licenceNumber = licenceNumber;
      spot.timestamp = timestamp;
      spot.returnTime = new Date();
      spot.status = parkingSpaceState[event];
      await spot.save();
    }

    var carInfo = {
      vehicle: vehicle,
      licenceNumber,
    };
    var eventInfo = {
      event: event,
      spotNo,
      state: 'spot',
      timestamp,
    };
    sendCarState(eventInfo, carInfo, 2);
    sendParkingLotInfo();
    setBookingInfo();
    return res.json({
      code: 0,
    });
  },

  'get /:spotNo': async function (req, res, next) {
    var spotNo = req.params.spotNo;
    var spot = await Spot.findOne({ spotNo }).select('-_id -__v');
    if (!spot) {
      return res.json({
        code: -1,
        msg: '车位不存在',
      });
    }
    return res.json({
      code: 0,
      data: spot,
    });
  },
};
