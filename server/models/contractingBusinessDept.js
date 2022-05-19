const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ContractingBusinessDept = new Schema({
  disable: { type: Boolean, default: false },
  lastUpdateby: { type: String },
  lastUpdateDate: { type: Date },
  type: { type: String },
  value: { type: String },
});

ContractingBusinessDept.plugin(mongoosePaginate);
// Admin.set('toObject', { virtuals: true });
ContractingBusinessDept.set('toJSON', { virtuals: true });

ContractingBusinessDept.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

module.exports = mongoose.model('ContractingBusinessDept', ContractingBusinessDept);
