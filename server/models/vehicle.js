const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const { Gearbox } = require('../enums');

const Vehicle = new Schema({
  activityCode: { type: String },
  allocationCoding: { type: String },
  assetNo: { type: String },
  charge: { type: Boolean, default: false },
  gearbox: { type: Number, enum: Object.values(Gearbox) },
  isSpare: { type: Boolean, default: false },
  isPoolCar: { type: Boolean },
  patronageRidership: { type: Number },
  autotollAccount: { type: String },
  autotollCode: { type: String },
  bodyBuild: { type: String },
  branchLocation: { type: String },
  cab: { type: String },
  carModel: { type: String },
  chassisNumber: { type: String },
  company: { type: String },
  contractingBusinessDept: { type: String },
  customerCode: { type: String },
  dateOfFirstRegistration: { type: Date },
  department: { type: String },
  driverName: { type: String },
  effDateFrom: { type: Date },
  effDateTo: { type: Date },
  emissionStandard: { type: String },
  engineNo: { type: String },
  gasCardNo: { type: String },
  GPSInstallation: { type: Boolean },
  GPSUnitNo: { type: String },
  groupLogo: { type: Boolean },
  lastUpdateBy: { type: String },
  lastUpdateDate: { type: Date },
  licenceNumber: { type: String },
  licenseRenewal: { type: Number },
  mainDriverStaffId: { type: String },
  maintenanceMileageDiff: { type: Number },
  marketFunction: { type: String },
  nonOfficeHrAuth: { type: String },
  projectNo: { type: String },
  purposeOfVehicle: { type: String },
  renewalMonth: { type: String },
  roadPermitNo: { type: String },
  roundedMonthlyRate: { type: Number },
  scrapDate: { type: Date },
  status: { type: String },
  subcontractorCode: { type: String },
  type: { type: String },
  typeOfCleaningServices: { type: String },
  typeOfParkingReinbursement: { type: String },
  userGrading: { type: String },
  vehicleFunction: { type: String },
  vehicleID: { type: Number },
  vehicleParkingLocation: { type: String },
  vehicleValue: { type: Number },
  VRDBodyType: { type: String },
  VRDClass: { type: String },
  VRDColor: { type: String },
  VRDCylinderCapacity: { type: Number },
  VRDGW: { type: String },
  VRDMake: { type: String },
  VRDRegisteredOwner: { type: String },
  VRDYearOfManufacture: { type: Number },
  addTime: { type: Date, default: Date.now },
  deleFlag: { type: Date }, //删除就赋值
});

// Vehicle.set('toObject', { virtuals: true });
Vehicle.set('toJSON', { virtuals: true });

Vehicle.pre('find', function () {
  this._conditions.deleFlag = { $exists: false };
});

Vehicle.virtual('permits', {
  ref: 'Permit',
  localField: '_id',
  foreignField: 'vehicleId',
  get(datas) {
    if (!datas) return undefined;
    return datas;
  },
});

Vehicle.virtual('spareUsed', {
  ref: 'Permit',
  localField: '_id',
  foreignField: 'vehicleId',
  get(datas) {
    if (!datas) return false;
    return datas.findIndex(f => f.inProgress) === -1 ? true : false;
  },
});

Vehicle.virtual('spot', {
  ref: 'Spot',
  localField: '_id',
  foreignField: 'vehicleId',
  justOne: true,
});

Vehicle.plugin(mongoosePaginate);

module.exports = mongoose.models.Vehicle || mongoose.model('Vehicle', Vehicle);
