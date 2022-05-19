const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Booking = new Schema({
  carType: { type: String },
  purpose: { type: String },
  timeFrom: { type: Date },
  timeTo: { type: Date },
  passenger: { type: Number },
  beforSOC: { type: Number }, // Wait out 剩余百分比电量
  beforTotalMileage: { type: Number }, // Wait out 仪表盘总里程
  afterSOC: { type: Number }, // Done 剩余百分比电量
  afterTotalMileage: { type: Number }, // Done 仪表盘总里程
  mileage: { type: Number }, // 当前行驶里程
  usedPower: { type: Number }, // 已使用电量
  remark: { type: String },
  addTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date },
  deleFlag: { type: Date }, //删除就赋值
});

Booking.plugin(mongoosePaginate);
// Admin.set('toObject', { virtuals: true });
Booking.set('toJSON', { virtuals: true });

Booking.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

Booking.virtual('permit', {
  ref: 'Permit',
  localField: '_id',
  foreignField: 'bookingId',
  justOne: true,
  // get(datas) {
  //   if (!datas) return undefined;
  //   return datas;
  // },
});

module.exports = mongoose.model('Booking', Booking);
