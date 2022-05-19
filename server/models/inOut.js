const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const { InOutEnum, InOutType } = require('../enums');

const InOut = new Schema({
  event: { type: String },
  status: { type: Number, enum: Object.values(InOutEnum) },
  permitId: { type: Schema.Types.ObjectId, ref: 'Permit' },
  type: { type: Number, enum: Object.values(InOutType) },
  licenceNumber: { type: String },
  msg: { type: String },
  scanningTime: { type: Date },
  passingTime: { type: Date },
  addTime: { type: Date, default: Date.now },
});

InOut.plugin(mongoosePaginate);
// Admin.set('toObject', { virtuals: true });
InOut.set('toJSON', { virtuals: true });

InOut.virtual('permit', {
  ref: 'Permit',
  localField: 'permitId',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('InOut', InOut);
