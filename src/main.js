import Vue from "vue";
import "babel-polyfill";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import "animate.css/animate.min.css";

import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import "@/assets/styles/theme/index.css";

import "@/assets/styles/index.less"; // 全局样式

import echarts from "echarts";

import App from "./App.vue";
import store from "./store";
import router from "./router";
import permission from "./directive/permission";

import "./assets/icons"; // icon
import "./permission"; // permission control

import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  download,
  handleTree
} from "@/utils/globalFun";

// 全局方法挂载
Vue.prototype.$echarts = echarts;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.download = download;
Vue.prototype.handleTree = handleTree;
Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
};

Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
};

Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg);
};

// 全局组件挂载
import "@/utils/globalComponents"; // 基础组件自动挂载
// 使用Vue.use()方法就会调用工具方法中的install方法
Vue.use(permission);
Vue.use(ElementUI);

// 引入rem
import "@/assets/js/rem";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
