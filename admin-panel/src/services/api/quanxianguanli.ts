// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 菜单列表 GET /admin/resources */
export async function getAdminResources(options?: { [key: string]: any }) {
  return request<{
    code: number;
    msg: string;
    data: {
      id: number;
      name: string;
      parentId: string;
      type: string;
      icon: string;
      route: string;
      sortNo: string;
      defaultResource: string;
      childrens: {
        id: number;
        name: string;
        childrens: {
          id?: number;
          name?: string;
          parentId?: string;
          type?: string;
          icon?: string;
          route?: string;
          sortNo?: string;
          defaultResource?: string;
          childrens?: Record<string, any>[];
        }[];
        parentId?: string;
        type?: string;
        icon?: string;
        route?: string;
        sortNo?: string;
        defaultResource?: string;
      }[];
    }[];
  }>('/admin/resources', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改角色 PUT /admin/role */
export async function putAdminRole(
  body: {
    roleName: string;
    remark: string;
    resourceIds: number[];
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/admin/role', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增角色 POST /admin/role */
export async function postAdminRole(
  body: {
    roleName: string;
    remark: string;
    resourceIds: number[];
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResult>('/admin/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 角色详情 GET /admin/role/${param0} */
export async function getAdminRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminRoleIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code: number;
    msg: string;
    data: {
      roleName: string;
      id: number;
      remark: string;
      createdAt: string;
      resourceIds: number[];
    };
  }>(`/admin/role/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除角色 DELETE /admin/role/${param0} */
export async function deleteAdminRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAdminRoleIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<Record<string, any>>(`/admin/role/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 角色列表 GET /admin/roles */
export async function getAdminRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminRolesParams,
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
      list: { id: number; rolename: string; createdAt: string }[];
    };
  }>('/admin/roles', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
