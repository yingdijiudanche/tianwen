const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const { LogType, LogSource } = require('../enums');

const SystemLog = new Schema({
  location: { type: String, required: true },
  type: { type: Number, enum: Object.values(LogType), required: true },
  source: { type: Number, enum: Object.values(LogSource), required: true },
  ip: { type: String },
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'Admin' },
  createTime: { type: Date, default: Date.now },
  deleFlag: { type: Date }, //删除就赋值
});
// SystemLog.set('toObject', { virtuals: true });
SystemLog.set('toJSON', { virtuals: true });

SystemLog.virtual('admin', {
  ref: 'Admin',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  get(v) {
    return v || null;
  },
});

SystemLog.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

SystemLog.plugin(mongoosePaginate);

module.exports = mongoose.model('SystemLog', SystemLog);
