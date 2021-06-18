import request from "@/utils/request";

// 重点关注列表
export function visitorStatistic(query) {
  return request({
    url: "/system/index/visitorStatistic",
    method: "get",
    params: query
  });
}
