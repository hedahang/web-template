import request from "@/utils/request";

// 查询轮播图列表
export function listBanner(query) {
  return request({
    url: "/system/turnsimg/list",
    method: "get",
    params: query
  });
}

// 查询轮播图详情
export function getBanner(id) {
  return request({
    url: "/system/turnsimg/get/" + id,
    method: "get"
  });
}

// 新增轮播图
export function addBanner(data) {
  return request({
    url: "/system/turnsimg/add",
    method: "post",
    data: data
  });
}

// 编辑轮播图
export function updateBanner(data) {
  return request({
    url: "/system/turnsimg/edit",
    method: "post",
    data: data
  });
}

// 删除轮播图
export function delBanner(id) {
  return request({
    url: "/system/turnsimg/delete/" + id,
    method: "delete"
  });
}
