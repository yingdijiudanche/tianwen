const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const VehicleType = new Schema({
  averageMileage: { type: String },
  lastUpdateBy: { type: String },
  lastUpdateDate: { type: Date },
  maxMoneyPerKM: { type: String },
  mileagePerMonth: { type: String },
  minMoneyPerKM: { type: String },
  type: { type: String },
  addTime: { type: Date, default: Date.now },
  deleFlag: { type: Date }, //删除就赋值
});

VehicleType.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

VehicleType.plugin(mongoosePaginate);
module.exports = mongoose.model('VehicleType', VehicleType);
