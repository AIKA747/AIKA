export default ({ me }: { me: API.UserInfo }) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  // 这里应该是 当前登录用户的角色信息
  const canSeeAdmin = !!(me && me?.name !== 'dontHaveAccess');
  return {
    canSeeAdmin,
  };
};
