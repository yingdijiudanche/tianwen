const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminVersion = new Schema({
  adminId: { type: Schema.Types.ObjectId, unique: true },
  buildNumber: { type: Number },
});

module.exports = mongoose.model('AdminVersion', AdminVersion);
