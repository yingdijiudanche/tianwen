const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const { parkingSpaceState, chargeType, spotType } = require('../enums');
const Spot = new Schema({
  spotNo: { type: String },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  licenceNumber: { type: String },
  status: {
    type: String,
    enum: Object.values(parkingSpaceState),
    required: true,
  },
  chargeType: {
    type: Number,
    enum: Object.values(chargeType),
    required: true,
  },
  chargePower: {
    type: String,
  },
  spotType: {
    type: Number,
    enum: Object.values(spotType),
  },
  frontSpotNo: { type: String },
  returnTime: { type: Date },
  addTime: { type: Date, default: Date.now },
  timestamp: { type: Number },
  deleFlag: { type: Date }, //删除就赋值
});
Spot.plugin(mongoosePaginate);
// Admin.set('toObject', { virtuals: true });
Spot.set('toJSON', { virtuals: true });

Spot.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

Spot.virtual('vehicle', {
  ref: 'Vehicle',
  localField: 'vehicleId',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('Spot', Spot);
