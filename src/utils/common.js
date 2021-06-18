import { Notification as Notify } from "element-ui";
import Cookies from "js-cookie";
import request from "./request";
import config from "./config";
import CryptoJS from "@/utils/crypto";
import Timer from "@/utils/timer";

let util = {
  // 开发日志
  log: (...args) => {
    let title = "";
    if (typeof args[0] === "object") {
      title = "开发调试";
    } else {
      title = args[0];
      args.shift(args[0]);
    }
    console.group(
      `%c${title}`,
      "font-size:12px;color:#24D864;border-radius:2px;background:#000;padding:2px 4px"
    );
    // console.log(...args);
    console.groupEnd();
  },
  // 在新窗口打开链接
  openNewWindow(url) {
    let routeData = this.$router.resolve({
      path: url
    });
    window.open(routeData.href, "_blank");
  },
  // 文件是否为图片
  isImage: fileName => {
    let allowSuffix = ["BMP", "JPG", "JPEG", "PNG", "GIF"];
    var suffixIndex = fileName.lastIndexOf(".");
    var suffix = fileName.substring(suffixIndex + 1).toUpperCase();

    return allowSuffix.includes(suffix);
  },
  // 是否支持该文件类型
  isSupportFileType: (fileName, type) => {
    let allowSuffix = type || [
      "XLS",
      "XLSX",
      "PPT",
      "PPTX",
      "DOC",
      "DOCX",
      "PDF",
      "BMP",
      "JPG",
      "JPEG",
      "PNG",
      "GIF",
      "ZIP",
      "TXT",
      "MP4",
      "3GP",
      "AVI"
    ];
    var suffixIndex = fileName.lastIndexOf(".");
    var suffix = fileName.substring(suffixIndex + 1).toUpperCase();

    return allowSuffix.includes(suffix);
  },

  /**
   * AES 加密
   *
   * @param {phone} 手机号
   * @returns {password} 密码
   */
  encrypt: (phone, password) => {
    var key = CryptoJS.enc.Utf8.parse(
      CryptoJS.MD5(phone)
        .toString()
        .slice(0, 16)
    );
    let rs = CryptoJS.AES.encrypt(password, key, {
      iv: key,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    }).toString();

    return rs;
  },
  md5: val => {
    return CryptoJS.MD5(val);
  },
  getFileUrl(value) {
    if (!value) {
      return "";
    }
    if (value.substr(0, 1) === "\\" || value.substr(0, 1) === "/") {
      return `${config.uploadBaseURL}${value}`;
    }
    return value;
  }
};

let msg = {
  error: function info(msg, title = "错误提示", callFun) {
    if (!info.show) {
      info.show = true;
      Notify({
        title,
        type: "error",
        duration: 2000,
        message: msg,
        onClose: function() {
          info.show = false;
          callFun && callFun();
        }
      });
    }
  },
  success: (msg, title = "成功提示") => {
    Notify({
      title: title,
      type: "success",
      duration: 2000,
      message: msg
    });
  },
  warning: (data, callFun) => {
    return Notify({
      title: "",
      dangerouslyUseHTMLString: true,
      message: `<div class='ui warnNotifyPop-content'>
                  <div class='notify-img'><img src='${data.img}' alt=""></div>
                  <div class='notify-box ui'>
                    <div class='notify-box-row ellitext'>${data.name}&nbsp;&nbsp;&nbsp;&nbsp;${data.time}</div>
                    <div class='notify-box-row ellitext'>${data.address}</div>
                    <div class='notify-box-row ellitext'>${data.devices}</div>
                  </div>  
                </div>`,
      duration: 86400,
      customClass: `warnNotifyPop ${data.type}`,
      position: "bottom-right",
      showClose: false,
      onClick: function() {
        callFun && callFun();
      }
    });
  }
};

export { Cookies as cookie, request, msg, util, config, Timer };
