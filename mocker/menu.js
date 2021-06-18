/* eslint-disable */

module.exports = {
  'GET /api/system/menu/getRouters': {
    "msg": "操作成功",
    "code": 200,
    "data": [{
      "name": "System",
      "path": "/system",
      "hidden": false,
      "redirect": "noRedirect",
      "component": "Layout",
      "alwaysShow": true,
      "meta": {
        "title": "系统管理",
        "icon": "system",
        "noCache": false
      },
      "children": [ {
        "name": "Banner",
        "path": "banner",
        "hidden": false,
        "component": "system/banner/index",
        "meta": {
          "title": "轮播管理",
          "icon": "tree-table",
          "noCache": false
        }
      },]
    }]
  }
};