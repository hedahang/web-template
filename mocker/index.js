/* eslint-disable */

const login = require("./login");
const user = require("./user");
const upload = require('./upload');
const menu = require('./menu');
const banner = require('./banner');


const proxy = {
  // Priority processing.
  // apiMocker(app, path, option)
  // This is the option parameter setting for apiMocker
  _proxy: {
    proxy: {
      // Turn a path string such as `/user/:name` into a regular expression.
      // https://www.npmjs.com/package/path-to-regexp
      // '/ys/websocket/(.*)': 'ws://10.10.10.107:18080',
      // "/api/(.*)": "http://192.168.1.151:9201",
      // "/api/(.*)": "http://192.168.1.129:8080",
      // "/api/(.*)": "https://zw.sczhongdun.com:20443",
      // "/api/(.*)": "http://ys.sczhongdun.com:8403",
    },
    // rewrite target's url path. Object-keys will be used as RegExp to match paths.
    // https://github.com/jaywcjlove/mocker-api/issues/62
    pathRewrite: {
      '^/api': '',
    },
    // changeHost: true,
    // modify the http-proxy options
    httpProxy: {
      options: {
        // ws: true
        // ignorePath: true,
      },
      listeners: {
        proxyReq: function(proxyReq, req, res, options) {
          console.log(
            `proxyReq ${proxyReq.agent.protocol} ${
              Object.keys(proxyReq.agent.sockets)[0]
            } ${proxyReq.path}`
          );
        },
      },
    },
  },
  // =====================
  ...login,
  ...user,
  ...upload,
  ...menu,
  ...banner
};
module.exports = proxy;
