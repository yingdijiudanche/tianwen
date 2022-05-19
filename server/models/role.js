const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Role = new Schema({
  name: { type: String, required: true, unique: true },
  addTime: { type: Date, default: Date.now },
  menuIds: {
    type: [{ type: Schema.Types.ObjectId }],
    ref: 'menusIds',
    default: [],
  },
  deleFlag: { type: Date }, //删除就赋值
});
Role.set('toJSON', { virtuals: true });

Role.virtual('menus', {
  ref: 'Menu',
  localField: 'menuIds',
  foreignField: '_id',
  options: { sort: { sort: 1 } },
});

Role.virtual('admins', {
  ref: 'Admin',
  localField: '_id',
  foreignField: 'roleId',
});

Role.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

module.exports = mongoose.model('Role', Role);
