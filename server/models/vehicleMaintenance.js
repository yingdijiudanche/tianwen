const mongoose = require(mongoose);
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const VehicleMaintenance = new Schema({
  CreatedBy: { type: String },
  CreatedOn: { type: Date },
  Department: { type: String },
  DriverName: { type: String },
  ID: { type: Long },
  LicenceNumber: { type: String },
  MaintenanceDate: { type: Date },
  MaintenanceMileage: { type: Number },
  vehicle_id: { type: Schema.Types.ObjectId, required: true, ref: 'Vehicle' },
  addTime: { type: Date, default: Date.now },
  deleFlag: { type: Date }, //删除就赋值
});

VehicleMaintenance.pre(find, function () {
  this._conditions.deleFlag = { $exists: false };
});

VehicleMaintenance.plugin(mongoosePaginate);
module.exports = mongoose.model('VehicleMaintenance', VehicleMaintenance);
