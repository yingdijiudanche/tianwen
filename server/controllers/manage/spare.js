const Vehicle = require('../../models/vehicle');
const Permit = require('../../models/permit');
const { setBookingInfo } = require('../../handler/parking');
const { PermitStatus } = require('../../enums');

/**
 * @type {import('..').NormalApi}
 */
module.exports = {
  'get /all': async function (req, res, next) {
    const result = await Vehicle.find({ isSpare: true }).populate('spareUsed');
    res.json(result);
  },
  'post ': async function (req, res, next) {
    const { permitId, licenceNumber, vehicleId } = req.body;

    await Permit.findByIdAndUpdate(permitId, {
      vehicleId,
      licenceNumber,
      status: PermitStatus.Waiting,
    });

    await setBookingInfo();
    return res.sendStatus(200);
  },
};
