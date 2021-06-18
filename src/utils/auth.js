import Cookies from "js-cookie";

const userInfo = getCookieName("userInfo");
const token = getCookieName("AUTH_TOKEN");

function getCookieName(name) {
  return window.location.port ? `${name}_${window.location.port}` : name;
}
export function getUserInfo() {
  var rs = Cookies.get(userInfo);
  return rs ? JSON.parse(rs) : "";
}
export function setUserInfo(val) {
  val = JSON.stringify(val);
  return Cookies.set(userInfo, val);
}
export function removeUserInfo() {
  return Cookies.remove(userInfo);
}
export function getToken() {
  return Cookies.get(token) || "";
}
export function setToken(val) {
  return Cookies.set(token, val);
}
export function removeToken() {
  return Cookies.remove(token);
}
