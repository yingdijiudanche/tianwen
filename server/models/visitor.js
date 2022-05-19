const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Visitor = new Schema({
  companyName: { type: String },
  fullName: { type: String },
  contactPerson: { type: String },
  admissionNoticeEmail: { type: String },
  contactingDepartmentId: { type: Schema.Types.ObjectId, ref: 'ContractingBusinessDept' },
  applicantId: { type: Schema.Types.ObjectId, ref: 'Admin' },
  carPlateNos: { type: [] },
  visitDate: { type: Date },
  timeEst: { type: [Date] },
  refNo: { type: String },
  addTime: { type: Date, default: Date.now },
  deleFlag: { type: Date }, //删除就赋值
});

Visitor.plugin(mongoosePaginate);
// Admin.set('toObject', { virtuals: true });
Visitor.set('toJSON', { virtuals: true });

Visitor.virtual('permit', {
  ref: 'Permit',
  localField: '_id',
  foreignField: 'visitorId',
  justOne: true,
});

Visitor.virtual('applicant', {
  ref: 'Admin',
  localField: 'applicantId',
  foreignField: '_id',
  justOne: true,
  get(v) {
    return v?.name;
  },
});

Visitor.virtual('deptName', {
  ref: 'ContractingBusinessDept',
  localField: 'contactingDepartmentId',
  foreignField: '_id',
  justOne: true,
  get(v) {
    return v?.value;
  },
});

Visitor.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

module.exports = mongoose.model('Visitor', Visitor);
