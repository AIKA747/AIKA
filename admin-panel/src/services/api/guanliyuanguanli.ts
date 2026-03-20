// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 修改管理员 PUT /admin/user */
export async function putAdminUser(
  body: {
    username: string;
    nickname: string;
    roleId: number;
    id: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/admin/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增管理员 POST /admin/user */
export async function postAdminUser(
  body: {
    username: string;
    nickname: string;
    roleId: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/admin/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员详情 GET /admin/user/${param0} */
export async function getAdminUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminUserIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      username: string;
      nickname: string;
      avatar: string;
      roleId: number;
      createdAt: string;
    };
  }>(`/admin/user/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除管理员 DELETE /admin/user/${param0} */
export async function deleteAdminUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAdminUserIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/admin/user/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 重置密码 PATCH /admin/user/${param0} */
export async function patchAdminUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.patchAdminUserIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResult>(`/admin/user/${param0}`, {
    method: 'PATCH',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 管理员列表 GET /admin/users */
export async function getAdminUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminUsersParams,
  options?: { [key: string]: any },
) {
  return request<{
    code: number;
    msg: string;
    data: {
      total: number;
      pageNum: number;
      pageSize: number;
      pages: number;
      list: {
        id: number;
        username: string;
        nickname: string;
        createdAt: string;
        roleId: number;
        roleName: string;
        avatar: string;
        userStatus: string;
      }[];
    };
  }>('/admin/users', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
