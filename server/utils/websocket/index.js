var config = require('../../config');
var { initParkingLot } = require('../../handler/parking');
var { URLSearchParams } = require('url');
var { set, get } = require('lodash');
const jwt = require('jsonwebtoken');

const Ws = require('ws');

const USER_TOKEN = Symbol('user');

const INTERCEPTORS = Symbol('WebSocket#interceptors');

const HANDLE_MESSAGE = Symbol('WebSocket#message');

const HANDLE_CLOSE = Symbol('WebSocket#close');

const HANDLE_ERROR = Symbol('WebSocket#error');

class WebSocket {
  constructor(server) {
    this.server = server;
    this.wss = null;
    this.sessions = new Set();
  }

  /**
   * 初始化，挂载 socket
   */
  init() {
    this.wss = new Ws.Server({
      path: '/ws/message',
      noServer: true,
    });

    this.server.on('upgrade', this[INTERCEPTORS].bind(this));

    this.wss.on('connection', async socket => {
      (await initParkingLot()).map(m => socket.send(JSON.stringify(m)));
      socket.on('message', this[HANDLE_MESSAGE].bind(this, socket));
      socket.on('close', this[HANDLE_CLOSE].bind(this));
      socket.on('error', this[HANDLE_ERROR].bind(this));
    });

    return this.wss;
  }

  [INTERCEPTORS](request, socket, head) {
    // 是否开启 websocket 的鉴权拦截器
    if (config.websocket.intercept) {
      const params = new URLSearchParams(request.url.slice(request.url.indexOf('?')));
      const token = params.get('token');
      try {
        this.wss.handleUpgrade(request, socket, head, ws => {
          set(ws, USER_TOKEN, token);
          this.sessions.add(ws);
          this.wss.emit('connection', ws, request);
        });
      } catch (error) {
        socket.destroy();
      }
      return;
    }
    this.wss.handleUpgrade(request, socket, head, ws => {
      this.sessions.add(ws);
      this.wss.emit('connection', ws, request);
    });
  }

  [HANDLE_MESSAGE](socket, message) {
    try {
      socket.send(JSON.stringify('服务的接受信息:' + message));
      let { type } = JSON.parse(message);
      switch (type) {
        case '0000': //  心跳
          socket.send(JSON.stringify({ code: 0, type: type, msg: 'heartbeat ok' }));
          break;
      }
    } catch (err) {
      //console.log(err);
    }
  }

  [HANDLE_CLOSE]() {
    for (const session of this.sessions) {
      if (session.readyState === Ws.CLOSED) {
        this.sessions.delete(session);
      }
    }
  }

  [HANDLE_ERROR](session, error) {
    //console.log(error);
  }

  /**
   * 发送消息
   *
   * @param {string} token  用户token
   * @param {string} message 消息
   */
  sendMessage(token, message) {
    for (const session of this.sessions) {
      if (session.readyState === Ws.OPEN && get(session, USER_TOKEN) === token) {
        session.send(message);
        break;
      }
    }
  }

  /**
   * 向指定用戶發送消息
   * @param {*} userId 用戶ID
   * @param {*} message 消息
   */
  sendMessageByUserId(userId, message) {
    for (const session of this.sessions) {
      if (session.readyState === Ws.OPEN) {
        let token = get(session, USER_TOKEN);
        let auth = jwt.decode(token);
        if (auth.userId == userId) {
          session.send(message);
        }
      }
    }
  }

  /**
   * 发送消息
   *
   * @param {WebSocket} session 当前会话
   * @param {string} message 消息
   */
  sendMessageToSession(session, message) {
    session.send(message);
  }

  /**
   * 广播
   *
   * @param {string} message 消息
   */
  broadcast(message) {
    this.sessions.forEach(session => {
      if (session.readyState === Ws.OPEN) {
        session.send(message);
      }
    });
  }

  /**
   * 获取所有会话
   */
  getSessions() {
    return this.sessions;
  }

  /**
   * 获得当前连接数
   */
  getConnectionCount() {
    return this.sessions.size;
  }
}

module.exports = WebSocket;
