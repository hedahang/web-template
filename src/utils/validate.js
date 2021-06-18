/**
 * Created by munachar on 16/11/18.
 */

const regs = {
  // 正整数
  number: /^([1-9][0-9]*)$/,
  // 正浮点数
  numberFloat: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
  // 0 和正浮点数
  zeroAndFloat: /^(0|(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/,
  // 身份证
  idcard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/,
  // 手机号码
  mobile: /^(1[3-9])\d{9}$/,
  // 手机号或者座机号码
  phone: /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8})|(0\d{2,3}-?\d{7,8})$/,
  // 限两位小数
  numberTwoFloat: /^\d{1,10}(\.\d{1,2})?$/,
  // 正数且限两位小数
  numberTwoPositiveFloat: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
  // 经度
  jd: /^([0-9]|[1-9][0-9]|1[0-7][0-9]|180)(\.[0-9]+)?$/,
  // 纬度
  wd: /^([0-9]|[1-8][0-9]|90)(\.[0-9]+)?$/,
  // 密码字母数字下划线
  password: /^\w{5,32}$/,
  // 车牌号验证
  carno: /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}(([A-HJ-Z]{1}[A-HJ-NP-Z0-9]{5})|([A-HJ-Z]{1}(([DF]{1}[A-HJ-NP-Z0-9]{1}[0-9]{4})|([0-9]{5}[DF]{1})))|([A-HJ-Z]{1}[A-D0-9]{1}[0-9]{3}警)))|([0-9]{6}使)|((([沪粤川云桂鄂陕蒙藏黑辽渝]{1}A)|鲁B|闽D|蒙E|蒙H)[0-9]{4}领)|(WJ[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼·•]{1}[0-9]{4}[TDSHBXJ0-9]{1})|([VKHBSLJNGCE]{1}[A-DJ-PR-TVY]{1}[0-9]{5})|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[XS]{1}[0-9]{4}应急)|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}([A-HJ-Z]{1}[A-HJ-NP-Z0-9]{4})学)|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}([A-HJ-Z]{1}[A-HJ-NP-Z0-9]{4})挂))$/,
  // 汉字数字字母
  chineseNumberLetter: /^[a-z0-9A-Z\u4e00-\u9fa5]+$/,
  // 汉字数字
  chineseNumber: /^[0-9\u4e00-\u9fa5]+$/
};

export function regex() {
  return regs;
}

export function isvalidUsername(str) {
  return str.trim().length > 0;
}

/****分割线****/
/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 手机号/身份证号特殊处理
 * isEdit 是否是编辑
 * noModify 编辑时判断是否修改
 */
export function phoneOrIdcardValidate(rule, value, callback, isEdit, noModify) {
  if (isEdit && noModify) {
    callback();
  } else {
    if (regs[rule.type].test(value)) {
      callback();
    } else {
      callback(new Error(rule.msg || "输入不正确"));
    }
  }
}
/**
 * 数字字母中文
 */
export function validateByCNL(rule, value, callback) {
  if (regs[rule.type].test(value)) {
    callback();
  } else {
    callback(new Error(rule.msg || "输入不正确"));
  }
}
