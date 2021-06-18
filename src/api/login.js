import request from "@/utils/request";

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  };
  return request({
    url: "/auth/login",
    method: "post",
    data: data
  });
}

// 获取用户详细信息
export function getInfo() {
  return request.get("/system/user/getInfo");
}

// 退出方法
export function logout() {
  return request({
    url: "/logout",
    method: "post"
  });
}
