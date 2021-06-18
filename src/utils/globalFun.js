/**
 * 通用js方法封装处理
 * Copyright (c) 2019 munachar
 */

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === "string") {
      time = time.replace(new RegExp(/-/gm), "/");
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
  var search = JSON.parse(JSON.stringify(params));
  if (null !== dateRange && "" !== dateRange) {
    if (typeof propName === "undefined") {
      search["startTime"] = dateRange[0];
      search["endTime"] = dateRange[1];
    } else {
      search["start" + propName] = dateRange[0];
      search["end" + propName] = dateRange[1];
    }
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).some(key => {
    if (datas[key].dictValue === "" + value) {
      actions.push(datas[key].dictLabel);
      return true;
    }
  });
  return actions.join("");
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
  var actions = [];
  var currentSeparator = undefined === separator ? "," : separator;
  var temp = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some(val => {
    Object.keys(datas).some(key => {
      if (datas[key].dictValue === "" + temp[val]) {
        actions.push(datas[key].dictLabel + currentSeparator);
      }
    });
  });
  return actions.join("").substring(0, actions.join("").length - 1);
}

// 通用下载方法
export function download(data, fileName = "download") {
  if (!data) {
    return;
  }
  // application/vnd.ms-excel
  var blob = new Blob([data], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
  });
  var url = window.URL.createObjectURL(blob);
  var aLink = document.createElement("a");
  aLink.style.display = "none";
  aLink.href = url;
  aLink.setAttribute("download", `${fileName}.xls`);
  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink); //下载完成移除元素
  window.URL.revokeObjectURL(url); //释放掉blob对象
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments,
    flag = true,
    i = 1;
  str = str.replace(/%s/g, function() {
    var arg = args[i++];
    if (typeof arg === "undefined") {
      flag = false;
      return "";
    }
    return arg;
  });
  return flag ? str : "";
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || "id";
  parentId = parentId || "parentId";
  children = children || "children";
  rootId =
    rootId ||
    Math.min.apply(
      Math,
      data.map(item => {
        return item[parentId];
      })
    ) ||
    "0";
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data));
  //循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId];
    });
    branchArr.length > 0 ? (father.children = branchArr) : "";
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != "" ? treeData : data;
}

/**
 * 在数组中查找指定的项，并返回数组路径，支持多维数组 ，数组对象嵌套
 * @param {*} data 数据源
 * @param {*} needle id字段 默认 '要查找的值'
 * @param {*} path 数组路径
 * @param {*} property 当被查找项是对象时（ 数组对象嵌套 ）这个参数作为要查找的值的属性名称 ，如果是多维数组不会有任何影响
 * @param {*} children 当被查找项是对象时（ 数组对象嵌套 ）这个参数作为子集合属性名称 ，如果是多维数组不会有任何影响
 */
export function array_search(
  data,
  needle,
  path = [],
  property = "id",
  children = "children"
) {
  if (
    data.some(item => {
      if (item[property] === needle) {
        path.push(item[property]);
        return true;
      } else if (item[children]) {
        path.push(item[property]);
        if (array_search(item[children], needle, path)) {
          return true;
        } else {
          path = [];
          return false;
        }
      } else {
        return false;
      }
    })
  ) {
    return path;
  } else {
    return null;
  }
}

/**
 * 去除无效的值
 * @param {*} value 数据源
 * @param {*} type 类型
 * @param {*} path 数组路径*/
export function validForbid(value, type) {
  let reg = /[^A-Za-z0-9\u4e00-\u9fa5]/g; // 中文数字字母
  if (type == 2) {
    reg = /[^0-9\u4e00-\u9fa5]/g; // 中文数字
  }
  return value.replace(reg, "");
}
