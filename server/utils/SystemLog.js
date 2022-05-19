const SystemLog = require('../models/systemLog');

/**
 * 记录日志
 * @param {object} req request 上下文
 * @param {object} res response 上下文
 * @param {string} location 日志產生位置
 * @param {number} type 日志类型 0: 操作日志 1: 錯誤日志
 * @param {number} source 日志來源 0: web 1: app
 * @param {string} content 日志内容
 */
module.exports = (req, res, location, type, source, content) => {
  let log = {
    location: location || req.originalUrl,
    type: type,
    source: source,
    ip: get_client_ip(req),
    content: content,
    userId: res.locals.userId || null,
  };

  const action = new SystemLog(log);
  action.save();
};

//获取url请求客户端ip
var get_client_ip = function (req) {
  var ip =
    req.headers['x-forwarded-for'] ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    '';
  if (ip.split(',').length > 0) {
    ip = ip.split(',')[0];
  }
  return ip.replaceAll(':', '').replaceAll('f', '');
};

String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};
