const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Admin = new Schema(
  {
    name: { type: String, required: true },
    account: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    staffNo: { type: String },
    notifyToken: { type: String }, //from firebase message
    disabled: { type: Boolean, default: false },
    addTime: { type: Date, default: Date.now },
    deleFlag: { type: Date }, //删除就赋值
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

Admin.virtual('roleName', {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
  get(v) {
    return v?.name;
  },
});

Admin.virtual('driver', {
  ref: 'Driver',
  localField: 'driverId',
  foreignField: '_id',
  justOne: true,
});

Admin.virtual('driverName', {
  ref: 'Driver',
  localField: 'driverId',
  foreignField: '_id',
  justOne: true,
  get(v) {
    return v?.nameEN;
  },
});

Admin.virtual('permit', {
  ref: 'Permit',
  localField: '_id',
  foreignField: 'adminId',
  get(datas) {
    return (datas && datas.find(f => f.status === 1)) || null;
  },
});

Admin.virtual('permits', {
  ref: 'Permit',
  localField: '_id',
  foreignField: 'adminId',
});

Admin.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

Admin.plugin(mongoosePaginate);

module.exports = mongoose.model('Admin', Admin);
