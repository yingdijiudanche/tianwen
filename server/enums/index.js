/** @enum {nubmer} 系統日志類型 */
const LogType = {
  ///操作日志
  operate: 0,

  ///错误日志
  error: 1,
};

/** @enum {nubmer} 日志來源 */
const LogSource = {
  ///管理系統Log
  web: 0,

  ///App Log
  app: 1,

  ///全局捕捉
  global: 2,
};
/** @enum {number} */
const Gearbox = {
  Manual: 1,
  Automatic: 2,
};
const parkingSpaceState = {
  IN: 'In',
  OUT: 'Out',
};
const chargeType = {
  normal: 1,
  charge: 2,
  superCharge: 3,
};
const spotType = {
  normal: 1,
  super: 2,
};
const DriverType = {
  PrivateCar: 1,
  //考2可加簽1
  LightGoodsVehicle: 2,
  //考18可加簽2
  MediumGoodsVehicle: 18,
  //考19可加簽2/18
  HeavyGoodsVehicle: 19,
  SpecialPurposeVehicle: 21,
};
const PermitStatus = {
  WaitForCheck: 0, // 等待Checking
  Checking: 1, // 当前状态可check in
  Waiting: 2, // 已搶车/等待入場(Permit為 Visitor時)
  WaitForOut: 3, // 用户已填写当前电量与里程数
  Outing: 4, // 已出场
  In: 5, //车辆已入场(Visitor時)
  Done: 6, //已完成
  Abnormal: 7, //當車輛超出Permit active to未入場還車，狀態則爲異常
  Expired: 8, //已過期
};
const PermitType = {
  Booking: 1, // 預約车
  Visitor: 2, // 訪客车
};
/**所有数组类型的enum，默认为 value=index, label=element*/

/** @enum {number} */
const VersionTypeEnum = {
  release: 0,
  test: 1,
  backup: 2,
};
/** @enum {string} */
const AppPlatformEnum = {
  android: 'Android',
  ios: 'IOS',
};
/** @enum {string} */
const InOutEnum = {
  normal: 0,
  abnormal: 1,
  error: 2,
};
/** @enum {string} */
const InOutType = {
  driver: 0,
  visitor: 1,
  other: 2,
};
module.exports = {
  LogType,
  LogSource,
  parkingSpaceState,
  chargeType,
  spotType,
  DriverType,
  PermitStatus,
  VersionTypeEnum,
  AppPlatformEnum,
  InOutEnum,
  Gearbox,
  InOutType,
  PermitType,
};
