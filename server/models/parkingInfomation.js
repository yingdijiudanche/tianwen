const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ParkingInfomation = new Schema({
  photo: { type: String },
  parkingReimbursement: { type: Number }, // 停车费
  remark: { type: String },
  addTime: { type: Date, default: Date.now },
  deleFlag: { type: Date }, //删除就赋值
});

ParkingInfomation.plugin(mongoosePaginate);
// Admin.set('toObject', { virtuals: true });
ParkingInfomation.set('toJSON', { virtuals: true });

ParkingInfomation.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

module.exports = mongoose.model('ParkingInfomation', ParkingInfomation);
