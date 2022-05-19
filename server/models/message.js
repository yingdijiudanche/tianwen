const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Message = new Schema({
  adminId: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  richText: { type: String, required: true },
  isReaded: { type: Boolean, default: false },
  navigateTo: { type: String },
  data: { type: String },
  addTime: { type: Date, default: Date.now },
});
Message.plugin(mongoosePaginate);
module.exports = mongoose.model('Message', Message);
