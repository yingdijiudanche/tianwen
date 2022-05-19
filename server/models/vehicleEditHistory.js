const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const VehicleEditHistory = new Schema({
  createdBy: { type: String },
  createdOn: { type: Date },
  dataField: { type: String },
  ID: { type: Long },
  newValue: { type: String },
  originalValue: { type: String },
  recordID: { type: Long },
  vehicle_id: { type: Schema.Types.ObjectId, required: true, ref: 'Vehicle' },
  addTime: { type: Date, default: Date.now },
  deleFlag: { type: Date }, //删除就赋值
});

VehicleEditHistory.pre(find, function () {
  this._conditions.deleFlag = { $exists: false };
});

VehicleEditHistory.plugin(mongoosePaginate);
module.exports = mongoose.model('VehicleEditHistory', VehicleEditHistory);
