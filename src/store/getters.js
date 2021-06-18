const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  userinfo: state => state.user.userinfo,
  smsCount: state => state.user.smsCount,
  unitIds: state => state.user.deptId || state.user.unitId,
  unitId: state => state.user.unitId,
  permission_routes: state => state.permission.routes,
  sidebarRouters: state => state.permission.sidebarRouters
};
export default getters;
