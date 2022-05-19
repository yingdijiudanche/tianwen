const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const TrafficNotice = new Schema({
  tnID: { type: String },
  // TNID
  trafficNoticesTypeID: { type: String },
  //TrafficNoticesTypeID
  titleEn: { type: String },
  //Title_EN
  titleTc: { type: String },
  //Title_TC
  titleSc: { type: String },
  //Title_SC
  startEffectiveDate: { type: Date },
  //StartEffectiveDate
  contentEn: { type: String },
  //Content_EN
  contentTc: { type: String },
  //Content_TC
  contentSc: { type: String },
  //Content_SC
  addTime: { type: Date, default: Date.now },
  //addTime

  deleFlag: { type: Date }, //删除就赋值
});
TrafficNotice.plugin(mongoosePaginate);
// Admin.set('toObject', { virtuals: true });
TrafficNotice.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TrafficNotice', TrafficNotice);
