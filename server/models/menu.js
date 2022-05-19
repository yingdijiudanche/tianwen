const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Menu = new Schema({
  // _id:{type:mongoose.Schema.Types.ObjectId},
  sort: { type: Number, required: true },
  path: { type: String, required: true },
  component: { type: String, default: '' },
  icon: { type: String, default: '' },
  name: { type: String, required: true },
  hidden: { type: Boolean, required: true },
  pid: { type: Schema.Types.ObjectId, ref: 'Menu' },
  deleFlag: { type: Date }, //删除就赋值
});

Menu.virtual('parent', {
  ref: 'Menu',
  localField: '_id',
  foreignField: 'pid',
});

Menu.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

Menu.plugin(mongoosePaginate);
module.exports = mongoose.model('Menu', Menu);
