const schedule = require('node-schedule');
const checkInNotify = require('./schedule/checkInNotify');
const setBookingStatus = require('./schedule/setBookingStatus');
const setVehicleBackToExpire = require('./schedule/setVehicleBackToExpire');

/**
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
 */
function autoRun() {
  if (process.env.NODE_ENV === 'development') {
    return;
  }
  // 每分钟查询
  // 发送抢车、抢车时间逾过期通知
  schedule.scheduleJob('1 * * * * *', checkInNotify);
  // 设置booking 过期或异常
  schedule.scheduleJob('1 * * * * *', setBookingStatus);
  // booking车返回停车场超过15分钟，设置为过期
  schedule.scheduleJob('1 * * * * *', setVehicleBackToExpire);
}

module.exports = autoRun;
