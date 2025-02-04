// 该服务为 vercel serve跨域处理
// const { createProxyMiddleware } = require('http-proxy-middleware') //commjs模块

import { createProxyMiddleware } from "http-proxy-middleware"; // es模块
// export.modules = (res, res) => {
export default (req, res) => {
  let target = "";
  // 代理目标地址
  // xxxxx 替换为你跨域请求的服务器 如： http://baidu.com
  if (req.url.startsWith("/api")) {
    //这里使用/api可能会与vercel serverless 的 api 路径冲突，根据接口进行调整
    target = "https://game-api.micromatrix.org"; //这里就是在vite中配置的一样
  }
  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      // 通过路径重写，去除请求路径中的 `/api`
      "^/api/": "/",
    },
  })(req, res);
};
