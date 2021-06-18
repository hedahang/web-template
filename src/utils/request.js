import axios from "axios";
import router from "../router";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import { util, config } from "@/utils/common";
import errorCode from "@/utils/errorCode";

// 创建axios实例
const service = axios.create({
  // api 的base_url
  baseURL: config.baseURL || "",
  // 请求超时时间
  timeout: 500000,
  //指示是否跨站点访问控制请求
  withCredentials: true
});

// request拦截器
service.interceptors.request.use(
  config => {
    let AUTH_TOKEN = getToken();
    if (AUTH_TOKEN) {
      config.headers["Authorization"] = AUTH_TOKEN; // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行编辑
    }
    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?";
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof value !== "undefined") {
          if (typeof value === "object") {
            for (const key of Object.keys(value)) {
              let params = propName + "[" + key + "]";
              var subPart = encodeURIComponent(params) + "=";
              url += subPart + encodeURIComponent(value[key]) + "&";
            }
          } else {
            url += part + encodeURIComponent(value) + "&";
          }
        }
      }
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config;
  },
  error => {
    // Do something with request error
    util.log("request error", error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
var isShowMessageBox = false;
service.interceptors.response.use(
  res => {
    /**
     * code为非200是抛错 可结合自己业务进行编辑
     */
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    // 50001:Token 失效了;
    if (code === 50001) {
      if (isShowMessageBox) return Promise.reject("error");
      isShowMessageBox = true;
      MessageBox.confirm(
        "登录状态已过期，您可以继续留在该页面，或者重新登录",
        "系统提示",
        {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          isShowMessageBox = false;
          store.dispatch("LogOut").then(() => {
            router.push(`/login?redirect=${router.currentRoute.fullPath}`);
          });
        })
        .catch(() => {
          isShowMessageBox = false;
        });
      return Promise.reject("error");
    } else if (code == 500) {
      Message({
        message: msg,
        type: "error"
      });
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      Notification.error({
        title: msg
      });
      return Promise.reject("error");
    } else {
      return res.data;
    }
  },
  error => {
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: "error",
      duration: 3 * 1000
    });
    return Promise.reject(error);
  }
);

let request = Object.assign({}, service);
request.get = (url, params) => {
  return service.get(url, {
    params
  });
};
request.delete = (url, params) => {
  return service.delete(url, {
    params
  });
};
// export default request;
export default service;
