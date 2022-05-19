var redis = require('redis');
const { getLogger } = require('./log4js/index');
var logger = getLogger();
// 服务器 Redis密码：kumshing-ksadmin-ddu
// var client = redis.createClient(6379, '192.168.171.135', { auth_pass: 'Wayne.peng' });
var client = redis.createClient(31003, '172.16.0.252', { auth_pass: 'kumshing-ksadmin-ddu' });

client.on('error', function (err) {
  console.log(err);
});

client.on('connect', function () {
  console.log('redis connect success!');
});
const redisHelper = {
  get: async key => {
    let val = await new Promise((resovle, reject) => {
      client.get(key, (err, res) => {
        if (err) reject(err);
        else resovle(res);
      });
    });
    logger.info(`get cache from redis key:${key} val :${val}`);
    return val;
  },
  set: async (key, value, expireTime) => {
    return new Promise((resovle, reject) => {
      client.set(key, value, (err, res) => {
        if (err) return reject(err);
        else return resovle(res);
      });
      if (expireTime) {
        client.expire(key, expireTime); //单位 *秒自动过期
      } else {
        client.expire(key, 60 * 60); //单位 *秒自动过期 默认60分钟过期
      }
    });
  },
};

module.exports = redisHelper;
