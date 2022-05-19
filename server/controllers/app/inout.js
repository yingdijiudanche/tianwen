const dayjs = require('dayjs');
const Permit = require('../../models/permit');
const Vehicle = require('../../models/Vehicle');
const InOut = require('../../models/inOut');
const SystemLog = require('../../utils/SystemLog');
// const decodeDsl = require('../../utils/redisHelper');
const { sendCarState, setBookingInfo, sendParkingLotInfo } = require('../../handler/parking');
const { PermitStatus, InOutEnum, InOutType } = require('../../enums');
module.exports = {
  // 判断车辆是否进场
  'post /': async function (req, res, next) {
    const { licenceNumber, timestamp, event } = req.body;
    SystemLog(
      req,
      res,
      'post /inout',
      1,
      1,
      `event: ${event}, licenceNumber: ${licenceNumber}, timestamp: ${timestamp}`
    );
    if (!licenceNumber) return res.json({ code: -1, msg: 'Missing Licence Number' });
    if (!event) return res.json({ code: -2, msg: 'Missing event' });
    if (event.toLocaleLowerCase() != 'in' && event.toLocaleLowerCase() != 'out')
      return res.json({ code: -3, msg: 'Invalid Event' });
    if (!timestamp) return res.json({ code: -4, msg: 'Missing timestamp' });

    const inout = await InOut.findOne({ licenceNumber: licenceNumber }).sort({ addTime: -1 });

    const addInout = async () => {
      await InOut.create({
        event,
        status: InOutEnum.error,
        type: InOutType.other,
        msg: 'No perv in/out record',
        passingTime: timestamp,
        licenceNumber,
      });
    };

    if (!inout) {
      // licenceNumber
      await addInout();
      return res.json({ code: -1, msg: 'Invalid inout' });
    }
    if (dayjs(timestamp).diff(dayjs(inout.addTime), 'minute') > 10) {
      await addInout();
      return res.json({ code: -1, msg: 'Time out' });
    }

    const vehicle = await Vehicle.findOne({ licenceNumber });
    var carInfo = {
      vehicle: vehicle,
      licenceNumber,
    };
    var eventInfo = {
      event: event,
      timestamp,
    };

    //TODO... Visitor入场发送通知
    let status = inout.type === InOutType.visitor ? PermitStatus.Done : PermitStatus.Outing;
    if (inout.event.toLocaleLowerCase() === 'in') {
      status = inout.type === InOutType.visitor ? PermitStatus.In : PermitStatus.WaitForOut;
    }
    await Permit.updateOne(
      { _id: inout.permitId },
      {
        $set: {
          status: status,
        },
      }
    );
    await InOut.updateOne(
      { _id: inout._id },
      {
        $set: {
          passingTime: timestamp,
        },
      }
    );

    sendCarState(eventInfo, carInfo, 1);
    sendParkingLotInfo();
    setBookingInfo();
    res.json({ code: 0 });
  },
};
