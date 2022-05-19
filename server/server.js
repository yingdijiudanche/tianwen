const express = require('express');
const path = require('path');
const WebSocket = require('./utils/websocket/index.js');
const SystemLog = require('./utils/SystemLog');
const { LogType, LogSource } = require('./enums');
const app = express();
const { initWs } = require('./handler/webSocketHandler.js');
const { initSpot } = require('./handler/parking.js');
require('express-async-errors');
const bodyParser = require('body-parser');
const http = require('http');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
var { connectDB } = require('./db/connetDB');
var apis = require('./controllers/index');

const config = require('./config');
const port = process.env.PORT || 31015;
connectDB();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('./uploads'));
app.use('/apk', express.static('./apk'));
// app.use('/img',express.static('./public'));
app.all('/api/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With,Content-Type,Authorization,Token,TimeStamp'
  ); //NeedSync Authorization
  res.header('Access-Control-Allow-Methods', 'PUT,PATCH,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json; charset=utf-8');
  // res.header('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
  //cosole.log(req.headers);
  if (req.method === 'OPTIONS') {
    //浏览器处理跨域原理，发出请求前先发出一个option请求 询问是否允许
    res.sendStatus(200);
  } else {
    next();
  }
});

app.all('/api/*', function (req, res, next) {
  try {
    let status = 200;
    let pass = ['login', 'export', 'download', 'parking'];
    if (!pass.find(f => req.originalUrl.toLocaleLowerCase().includes(f.toLocaleLowerCase()))) {
      const token = req.headers.token;
      if (token) {
        const decoded = jwt.verify(token, config.jwtSecretOfBack);
        if (decoded) {
          let diffTime =
            decoded.user.name.toLocaleLowerCase() === 'foreign'
              ? 1
              : dayjs(decoded.user.exp).diff(dayjs());
          if (diffTime > 0) {
            res.locals.userId = decoded.user.id;
            res.locals.userName = decoded.user.name;
            res.locals.roleName = decoded.user.roleName;
            res.locals.isAdmin = decoded.user.roleName
              ? decoded.user.roleName === 'System Admin'
              : false;
          } else {
            status = 401;
          }
        } else {
          status = 401;
        }
      } else {
        status = 401;
      }
    }
    if (status === 200) {
      next();
    } else {
      res.sendStatus(status);
    }
  } catch (error) {
    res.sendStatus(401);
  }
});

app.use('/api', apis);

app.use('/spot', express.static('./spot'));
app.get('/spot/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'spot', 'index.html'));
});

app.use('/manage', express.static('./dist'));
app.get('/manage/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// error handler
app.use(function (err, req, res, next) {
  console.log('catched error =>', err);
  SystemLog(req, res, null, LogType.operate, LogSource.global, err.message);
  res.status(err.status || 500);
  res.send(err.message);
});

let server = http.createServer(app);
const ws = new WebSocket(server);
ws.init();
initWs(ws);
initSpot(ws);
server.listen(port);
server.on('listening', () => {
  let addr = server.address();
  console.log(`GreenFacility listening at http://localhost:${addr.port}`);
});
