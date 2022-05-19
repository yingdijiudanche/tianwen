const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const { PermitStatus, PermitType } = require('../enums');

const Permit = new Schema({
  qrCode: { type: String },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  // driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
  visitorId: { type: Schema.Types.ObjectId, ref: 'Visitor' },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
  adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
  licenceNumber: { type: String },
  authorizedType: { type: Number },
  activeFrom: { type: Date },
  activeTo: { type: Date },
  type: { type: Number, enum: Object.values(PermitType) },
  status: { type: Number, enum: Object.values(PermitStatus) },
  inProgress: { type: Boolean, default: true }, // 是否在进行中，当还车之后，状态改为false
  addTime: { type: Date, default: Date.now },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  isExpireReturn: { type: Boolean, default: false },
  sentCheckNotify: { type: Boolean, default: false },
  sentExpirationNotify: { type: Boolean, default: false },
  expiredInfo: { type: String },
  abnormalInfo: { type: String },
  deleFlag: { type: Date }, //删除就赋值
});

Permit.plugin(mongoosePaginate);
// Admin.set('toObject', { virtuals: true });
Permit.set('toJSON', { virtuals: true });

Permit.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

Permit.virtual('vehicle', {
  ref: 'Vehicle',
  localField: 'vehicleId',
  foreignField: '_id',
  justOne: true,
});

// Permit.virtual('driver', {
//   ref: 'Driver',
//   localField: 'driverId',
//   foreignField: '_id',
// });

Permit.virtual('visitor', {
  ref: 'Visitor',
  localField: 'visitorId',
  foreignField: '_id',
  justOne: true,
});

Permit.virtual('booking', {
  ref: 'Booking',
  localField: 'bookingId',
  foreignField: '_id',
  justOne: true,
});

Permit.virtual('admin', {
  ref: 'Admin',
  localField: 'adminId',
  foreignField: '_id',
  justOne: true,
});

Permit.virtual('inOuts', {
  ref: 'InOut',
  localField: '_id',
  foreignField: 'permitId',
  get(datas) {
    if (!datas) return undefined;
    return datas;
  },
});

module.exports = mongoose.model('Permit', Permit);
