let wss = null;
const initWs = ws => {
  wss = ws;
};
const getWs = () => wss;

module.exports = { initWs, getWs };
