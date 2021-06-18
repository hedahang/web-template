import Vue from "vue";
import Pagination from "@/components/Pagination";

Vue.component("Pagination", Pagination);

// 全局组件注册
const requireComponent = require.context(
  // 其组件目录的相对路径
  "@/components",
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /Base([A-Z]\w+)+\/index\.(vue)$/
);
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  const componentName = fileName.split("/")[1];

  Vue.component(componentName, componentConfig.default || componentConfig);
});
