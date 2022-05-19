const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const { DriverType } = require('../enums');

const Driver = new Schema({
  nameEN: { type: String },
  nameCH: { type: String },
  email: { type: String },
  staffID: { type: String },
  authDate: { type: Date },
  type: { type: Number, enum: Object.values(DriverType), required: true },
  class: { type: Boolean, default: false },
  leaveRecord: { type: Array },
  qrCode: { type: String },
  addTime: { type: Date, default: Date.now },
  deleFlag: { type: Date }, //删除就赋值
});

Driver.plugin(mongoosePaginate);
// Admin.set('toObject', { virtuals: true });
Driver.set('toJSON', { virtuals: true });

Driver.pre('find', function () {
  // this._conditions.deleFlag = { $exists: false };
});

Driver.virtual('adminName', {
  ref: 'Admin',
  localField: '_id',
  foreignField: 'driverId',
  justOne: true,
  get(v) {
    return v?.name;
  },
});

Driver.virtual('adminId', {
  ref: 'Admin',
  localField: '_id',
  foreignField: 'driverId',
  justOne: true,
  get(v) {
    return v?._id.toString();
  },
});

module.exports = mongoose.model('Driver', Driver);
