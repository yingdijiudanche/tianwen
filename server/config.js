module.exports = {
  dbConnectStr: 'mongodb+srv://tianwen:admin@tianwen.wpo7e.mongodb.net/test',
  root_path: __dirname, //项目根绝对路径
  jwtSecretOfBack: 'green_facility_jwt_key_back',
  emailConfig: {
    host: 'smtp.qq.com',
    port: 465,
    secure: false,
    auth: {
      user: '1558139110@qq.com',
      pass: 'rsbxdqdoyvjtbagi',
    },
  },
  websocket: {
    path: '/ws/message',
    enable: true, // 是否开启 websocket 模块
    intercept: true, // 是否开启 websocket 的鉴权拦截器
  },
};
