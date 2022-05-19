const axios = require('axios');
// var deployUrl = 'http://localhost:5000/api';
var deployUrl = 'http://172.16.0.252:4396/api';
const ADMIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTg1MTU2MDZhYjk4ZDJmNDhmZjU4ODYiLCJleHBpcnkiOjE2MzYyNjc2MjczNzcsImlhdCI6MTYzNjI2NDAyN30.me5biJ0W4tNCosxxZVYF2JEw03aXwUUUsuOqwhygjVo';

const request = axios.create({
  baseURL: deployUrl,
  timeout: 30000, // 请求超时时间
});
exports.request = request;

const handleErr = e => {
  // //console.log('test api faile ===>', e.message);
  let msg = e.message;
  //console.log('request err', msg);
  // //console.log(e);
  if (e.response.status == 401) {
    msg += '\n you can run [ node login_api.js ] to get token';
    msg += '\n then copy the token in response and replace the value in [request.js] [ADMIN_TOKEN]';
  }
  return Promise.resolve({ code: 1, msg });
};

request.interceptors.request.use(config => {
  config.headers['Authorization'] = ADMIN_TOKEN;
  return config;
}, handleErr);

request.interceptors.response.use(response => Promise.resolve(response.data), handleErr);

module.exports = request;
