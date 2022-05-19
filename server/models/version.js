const mongoose = require('mongoose');
const { AppPlatformEnum, VersionTypeEnum } = require('../enums');
const Schema = mongoose.Schema;

const Version = new Schema({
  version: { type: String, required: true },
  buildNumber: { type: Number },
  platform: { type: String, required: true, enum: Object.values(AppPlatformEnum) },
  type: { type: Number, enum: Object.values(VersionTypeEnum) }, //0=正式版,1=内测版,2=备份
  typeAlias: { type: String }, //测试版别名 比如 红米特供，IOS13专属
  description: { type: String },
  addTime: { type: Date, default: Date.now },
  lastUpdateTime: { type: Date },
  downloadUrl: { type: String },
  memberIds: { type: [Schema.Types.ObjectId] },
  forceUpdate: { type: Boolean, default: false },
});

module.exports = mongoose.model('Version', Version);
